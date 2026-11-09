import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/shared/lib/api";
import { LoginForm } from "../components/LoginForm";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const apiFetchMock = vi.fn();
vi.mock("@/shared/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/shared/lib/api")>("@/shared/lib/api");
  return {
    ...actual,
    apiFetch: (...args: unknown[]) => apiFetchMock(...args),
  };
});

const setTokenMock = vi.fn();
vi.mock("@/shared/lib/auth", () => ({
  setToken: (...args: unknown[]) => setTokenMock(...args),
}));

beforeEach(() => {
  pushMock.mockClear();
  apiFetchMock.mockReset();
  setTokenMock.mockClear();
});

describe("LoginForm", () => {
  it("shows validation errors when submitted empty", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("メールアドレスを入力してください")).toBeInTheDocument();
    expect(screen.getByText("パスワードを入力してください")).toBeInTheDocument();
    expect(apiFetchMock).not.toHaveBeenCalled();
  });

  it("stores the token and redirects to /admin/posts on success", async () => {
    apiFetchMock.mockResolvedValueOnce({ token: "test-token" });
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Mail Address"), "admin@example.com");
    await user.type(screen.getByLabelText("Password"), "password");
    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => expect(setTokenMock).toHaveBeenCalledWith("test-token"));
    expect(pushMock).toHaveBeenCalledWith("/admin/posts");
  });

  it("shows an error message when credentials are rejected", async () => {
    apiFetchMock.mockRejectedValueOnce(new ApiError(401, { message: "Unauthorized" }));
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Mail Address"), "admin@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("メールアドレスまたはパスワードが正しくありません");
    expect(setTokenMock).not.toHaveBeenCalled();
  });
});
