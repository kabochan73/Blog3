import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminHeader } from "../components/AdminHeader";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/admin/posts",
}));

const apiFetchMock = vi.fn();
vi.mock("@/shared/lib/api", () => ({
  apiFetch: (...args: unknown[]) => apiFetchMock(...args),
}));

const clearTokenMock = vi.fn();
vi.mock("@/shared/lib/auth", () => ({
  getToken: () => "stored-token",
  clearToken: () => clearTokenMock(),
}));

beforeEach(() => {
  pushMock.mockClear();
  apiFetchMock.mockReset();
  clearTokenMock.mockClear();
});

describe("AdminHeader", () => {
  it("redirects to the public post list after logging out", async () => {
    apiFetchMock.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();

    render(<AdminHeader />);
    await user.click(screen.getByRole("button", { name: "Logout" }));

    expect(clearTokenMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("still clears the token and redirects when the logout API call fails", async () => {
    apiFetchMock.mockRejectedValueOnce(new Error("network error"));
    const user = userEvent.setup();

    render(<AdminHeader />);
    await user.click(screen.getByRole("button", { name: "Logout" }));

    expect(clearTokenMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
