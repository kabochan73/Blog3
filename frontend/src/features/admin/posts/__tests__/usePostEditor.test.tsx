import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { PostFormValues } from "../components/PostForm.schema";
import { usePostEditor } from "../hooks/usePostEditor";

const adminApiFetchMock = vi.fn();
vi.mock("@/shared/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/shared/lib/api")>("@/shared/lib/api");
  return {
    ...actual,
    adminApiFetch: (...args: unknown[]) => adminApiFetchMock(...args),
  };
});

const pushMock = vi.fn();
const replaceMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
}));

const formValues: PostFormValues = {
  title: "タイトル",
  slug: "example-post",
  status: "published",
  tags: [],
  excerpt: "",
  thumbnail: "",
  content: "本文",
};

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

beforeEach(() => {
  adminApiFetchMock.mockReset();
  pushMock.mockClear();
  replaceMock.mockClear();
});

describe("usePostEditor", () => {
  it("fetches the post by slug", async () => {
    adminApiFetchMock.mockResolvedValueOnce({ id: 1, slug: "example-post", title: "タイトル" });

    const { result } = renderHook(() => usePostEditor("example-post"), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.postQuery.isSuccess).toBe(true));
    expect(adminApiFetchMock).toHaveBeenCalledWith("/api/admin/posts/example-post");
  });

  it("does not redirect when the slug stays the same after updating", async () => {
    adminApiFetchMock
      .mockResolvedValueOnce({ id: 1, slug: "example-post" })
      .mockResolvedValueOnce({ id: 1, slug: "example-post" });

    const { result } = renderHook(() => usePostEditor("example-post"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.postQuery.isSuccess).toBe(true));

    result.current.updatePost.mutate(formValues);

    await waitFor(() => expect(result.current.updatePost.isSuccess).toBe(true));
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("redirects to the new slug when the slug changes after updating", async () => {
    adminApiFetchMock
      .mockResolvedValueOnce({ id: 1, slug: "example-post" })
      .mockResolvedValueOnce({ id: 1, slug: "new-slug" });

    const { result } = renderHook(() => usePostEditor("example-post"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.postQuery.isSuccess).toBe(true));

    result.current.updatePost.mutate(formValues);

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith("/admin/posts/new-slug/edit"));
  });

  it("redirects to the post list after deleting", async () => {
    adminApiFetchMock.mockResolvedValueOnce({ id: 1, slug: "example-post" }).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => usePostEditor("example-post"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.postQuery.isSuccess).toBe(true));

    result.current.deletePost.mutate();

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/admin/posts"));
  });
});
