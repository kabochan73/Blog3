import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/shared/lib/api";
import { ImageUploader } from "../components/ImageUploader";

const adminUploadFileMock = vi.fn();
vi.mock("@/shared/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/shared/lib/api")>("@/shared/lib/api");
  return {
    ...actual,
    adminUploadFile: (...args: unknown[]) => adminUploadFileMock(...args),
  };
});

beforeEach(() => {
  adminUploadFileMock.mockReset();
});

function makeFile(name = "photo.jpg") {
  return new File(["dummy content"], name, { type: "image/jpeg" });
}

describe("ImageUploader", () => {
  it("uploads the selected file and calls onUploaded with the returned url", async () => {
    adminUploadFileMock.mockResolvedValueOnce({ url: "/storage/images/example.jpg" });
    const onUploaded = vi.fn();
    const user = userEvent.setup();
    render(<ImageUploader onUploaded={onUploaded} label="画像を選択" />);

    await user.upload(screen.getByLabelText("画像を選択"), makeFile());

    await waitFor(() => expect(onUploaded).toHaveBeenCalledWith("/storage/images/example.jpg"));
    expect(adminUploadFileMock).toHaveBeenCalledWith("/api/admin/images", expect.any(File));
  });

  it("shows an uploading state while the request is in flight", async () => {
    let resolveUpload: (value: { url: string }) => void = () => {};
    adminUploadFileMock.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveUpload = resolve;
      }),
    );
    const user = userEvent.setup();
    render(<ImageUploader onUploaded={vi.fn()} label="画像を選択" />);

    await user.upload(screen.getByLabelText("画像を選択"), makeFile());

    expect(await screen.findByText("アップロード中...")).toBeInTheDocument();

    resolveUpload({ url: "/storage/images/example.jpg" });
    expect(await screen.findByText("画像を選択")).toBeInTheDocument();
  });

  it("shows an error message when the upload fails", async () => {
    adminUploadFileMock.mockRejectedValueOnce(new ApiError(422, { message: "画像の形式が正しくありません" }));
    const user = userEvent.setup();
    render(<ImageUploader onUploaded={vi.fn()} label="画像を選択" />);

    await user.upload(screen.getByLabelText("画像を選択"), makeFile());

    expect(await screen.findByText("画像の形式が正しくありません")).toBeInTheDocument();
  });
});
