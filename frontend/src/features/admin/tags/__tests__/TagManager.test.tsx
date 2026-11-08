import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TagManager } from "../components/TagManager";

const adminApiFetchMock = vi.fn();
vi.mock("@/shared/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/shared/lib/api")>("@/shared/lib/api");
  return {
    ...actual,
    adminApiFetch: (...args: unknown[]) => adminApiFetchMock(...args),
  };
});

function renderWithClient(ui: ReactNode) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
  adminApiFetchMock.mockReset();
});

describe("TagManager", () => {
  it("renders the tags returned by the API", async () => {
    adminApiFetchMock.mockResolvedValueOnce([
      { id: 1, name: "laravel", count: 0 },
      { id: 2, name: "nextjs", count: 0 },
    ]);

    renderWithClient(<TagManager />);

    expect(await screen.findByText("laravel")).toBeInTheDocument();
    expect(screen.getByText("nextjs")).toBeInTheDocument();
  });

  it("creates a tag and refetches the list", async () => {
    adminApiFetchMock
      .mockResolvedValueOnce([]) // initial list
      .mockResolvedValueOnce({ id: 1, name: "docker", count: 0 }) // POST
      .mockResolvedValueOnce([{ id: 1, name: "docker", count: 0 }]); // refetch after invalidate

    const user = userEvent.setup();
    renderWithClient(<TagManager />);

    await waitFor(() => expect(adminApiFetchMock).toHaveBeenCalledTimes(1));

    await user.type(screen.getByLabelText("タグ名"), "docker");
    await user.click(screen.getByRole("button", { name: "追加" }));

    await waitFor(() =>
      expect(adminApiFetchMock).toHaveBeenCalledWith("/api/admin/tags", {
        method: "POST",
        body: { name: "docker" },
      }),
    );
    expect(await screen.findByText("docker")).toBeInTheDocument();
  });

  it("updates a tag name", async () => {
    adminApiFetchMock
      .mockResolvedValueOnce([{ id: 1, name: "laravel", count: 0 }]) // initial list
      .mockResolvedValueOnce({ id: 1, name: "php", count: 0 }) // PUT
      .mockResolvedValueOnce([{ id: 1, name: "php", count: 0 }]); // refetch

    const user = userEvent.setup();
    renderWithClient(<TagManager />);

    await screen.findByText("laravel");
    await user.click(screen.getByRole("button", { name: "編集" }));

    const editForm = within(screen.getByRole("listitem"));
    const input = editForm.getByLabelText("タグ名");
    await user.clear(input);
    await user.type(input, "php");
    await user.click(editForm.getByRole("button", { name: "保存" }));

    await waitFor(() =>
      expect(adminApiFetchMock).toHaveBeenCalledWith("/api/admin/tags/1", {
        method: "PUT",
        body: { name: "php" },
      }),
    );
    expect(await screen.findByText("php")).toBeInTheDocument();
  });

  it("deletes a tag", async () => {
    adminApiFetchMock
      .mockResolvedValueOnce([{ id: 1, name: "laravel", count: 0 }]) // initial list
      .mockResolvedValueOnce(undefined) // DELETE
      .mockResolvedValueOnce([]); // refetch

    const user = userEvent.setup();
    renderWithClient(<TagManager />);

    await screen.findByText("laravel");
    await user.click(screen.getByRole("button", { name: "削除" }));

    await waitFor(() => expect(adminApiFetchMock).toHaveBeenCalledWith("/api/admin/tags/1", { method: "DELETE" }));
    await waitFor(() => expect(screen.queryByText("laravel")).not.toBeInTheDocument());
  });
});
