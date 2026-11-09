import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TagPicker } from "../components/TagPicker";

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

describe("TagPicker", () => {
  it("shows an empty-state message when there are no tags", async () => {
    adminApiFetchMock.mockResolvedValueOnce([]);

    renderWithClient(<TagPicker value={[]} onChange={vi.fn()} />);

    expect(await screen.findByText("タグがありません。先に「タグ管理」から作成してください。")).toBeInTheDocument();
  });

  it("highlights tags included in value", async () => {
    adminApiFetchMock.mockResolvedValueOnce([
      { id: 1, name: "laravel" },
      { id: 2, name: "nextjs" },
    ]);

    renderWithClient(<TagPicker value={["laravel"]} onChange={vi.fn()} />);

    expect(await screen.findByRole("button", { name: "laravel" })).toHaveClass("bg-foreground");
    expect(screen.getByRole("button", { name: "nextjs" })).not.toHaveClass("bg-foreground");
  });

  it("adds a tag to the selection when clicked", async () => {
    adminApiFetchMock.mockResolvedValueOnce([{ id: 1, name: "laravel" }]);
    const onChange = vi.fn();
    const user = userEvent.setup();

    renderWithClient(<TagPicker value={[]} onChange={onChange} />);

    await user.click(await screen.findByRole("button", { name: "laravel" }));

    expect(onChange).toHaveBeenCalledWith(["laravel"]);
  });

  it("removes a tag from the selection when it is already selected", async () => {
    adminApiFetchMock.mockResolvedValueOnce([{ id: 1, name: "laravel" }]);
    const onChange = vi.fn();
    const user = userEvent.setup();

    renderWithClient(<TagPicker value={["laravel"]} onChange={onChange} />);

    await user.click(await screen.findByRole("button", { name: "laravel" }));

    expect(onChange).toHaveBeenCalledWith([]);
  });
});
