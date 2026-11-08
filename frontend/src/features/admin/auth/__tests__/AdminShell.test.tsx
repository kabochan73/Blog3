import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminShell } from "../components/AdminShell";

const replaceMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => "/admin/posts",
}));

const getTokenMock = vi.fn();
vi.mock("@/shared/lib/auth", () => ({
  getToken: () => getTokenMock(),
  clearToken: vi.fn(),
}));

vi.mock("@/shared/lib/api", () => ({
  apiFetch: vi.fn(),
}));

beforeEach(() => {
  replaceMock.mockClear();
  getTokenMock.mockReset();
});

describe("AdminShell", () => {
  it("redirects to /login when no token is stored", () => {
    getTokenMock.mockReturnValue(null);

    render(
      <AdminShell>
        <p>protected content</p>
      </AdminShell>,
    );

    expect(replaceMock).toHaveBeenCalledWith("/login");
  });

  it("renders children without redirecting when a token is stored", () => {
    getTokenMock.mockReturnValue("stored-token");

    render(
      <AdminShell>
        <p>protected content</p>
      </AdminShell>,
    );

    expect(replaceMock).not.toHaveBeenCalled();
    expect(screen.getByText("protected content")).toBeInTheDocument();
  });
});
