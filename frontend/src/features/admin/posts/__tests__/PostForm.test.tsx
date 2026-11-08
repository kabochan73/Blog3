import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PostForm } from "../components/PostForm";

function renderWithClient(ui: ReactNode) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

const adminApiFetchMock = vi.fn();
vi.mock("@/shared/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/shared/lib/api")>("@/shared/lib/api");
  return {
    ...actual,
    adminApiFetch: (...args: unknown[]) => adminApiFetchMock(...args),
  };
});

vi.mock("@uiw/react-md-editor", () => ({
  default: ({ value, onChange }: { value?: string; onChange?: (value?: string) => void }) => (
    <textarea aria-label="本文" value={value} onChange={(event) => onChange?.(event.target.value)} />
  ),
}));

beforeEach(() => {
  adminApiFetchMock.mockReset();
  adminApiFetchMock.mockResolvedValue([{ id: 1, name: "laravel" }]);
});

describe("PostForm", () => {
  it("shows validation errors when required fields are empty", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    renderWithClient(<PostForm submitLabel="作成" onSubmit={onSubmit} />);

    await user.click(await screen.findByRole("button", { name: "作成" }));

    expect(await screen.findByText("タイトルを入力してください")).toBeInTheDocument();
    expect(screen.getByText("スラッグを入力してください")).toBeInTheDocument();
    expect(screen.getByText("本文を入力してください")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("normalizes the slug to lowercase with hyphens", async () => {
    const user = userEvent.setup();
    renderWithClient(<PostForm submitLabel="作成" onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText("スラッグ"), "My Post Title");

    expect(screen.getByLabelText("スラッグ")).toHaveValue("my-post-title");
  });

  it("submits the entered values", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    renderWithClient(<PostForm submitLabel="作成" onSubmit={onSubmit} />);

    // Wait for the dynamically imported MDEditor and the TagPicker's tag list
    // to finish loading before typing, otherwise their resolution re-renders
    // the form and drops values already typed into sibling fields.
    const contentField = await screen.findByLabelText("本文");
    await screen.findByRole("button", { name: "laravel" });

    await user.type(screen.getByLabelText("タイトル"), "記事タイトル");
    await waitFor(() => expect(screen.getByLabelText("タイトル")).toHaveValue("記事タイトル"));

    await user.type(screen.getByLabelText("スラッグ"), "example-post");
    await waitFor(() => expect(screen.getByLabelText("スラッグ")).toHaveValue("example-post"));

    await user.type(contentField, "本文です");
    await waitFor(() => expect(contentField).toHaveValue("本文です"));

    await user.click(screen.getByRole("button", { name: "laravel" }));
    await user.click(screen.getByRole("button", { name: "作成" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      title: "記事タイトル",
      slug: "example-post",
      status: "draft",
      tags: ["laravel"],
      excerpt: "",
      thumbnail: "",
      content: "本文です",
    });
  });
});
