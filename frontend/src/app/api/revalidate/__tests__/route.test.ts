import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { revalidatePath } from "next/cache";
import { POST } from "../route";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

function makeRequest(body: unknown, authorization?: string) {
  return new NextRequest("http://localhost:3000/api/revalidate", {
    method: "POST",
    headers: authorization ? { authorization } : undefined,
    body: JSON.stringify(body),
  });
}

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("REVALIDATE_SECRET", "secret");
  });

  it("認証ヘッダーがない場合は401を返す", async () => {
    const response = await POST(makeRequest({ paths: ["/"] }));

    expect(response.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("シークレットが一致しない場合は401を返す", async () => {
    const response = await POST(makeRequest({ paths: ["/"] }, "Bearer wrong"));

    expect(response.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("pathsが配列でない場合は422を返す", async () => {
    const response = await POST(makeRequest({ paths: "/" }, "Bearer secret"));

    expect(response.status).toBe(422);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("pathsが空配列の場合は422を返す", async () => {
    const response = await POST(makeRequest({ paths: [] }, "Bearer secret"));

    expect(response.status).toBe(422);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("paths内に文字列以外が含まれる場合は422を返す", async () => {
    const response = await POST(makeRequest({ paths: ["/", 1] }, "Bearer secret"));

    expect(response.status).toBe(422);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("認証に成功し、全てのpathsをrevalidatePathする", async () => {
    const response = await POST(makeRequest({ paths: ["/", "/posts/hello"] }, "Bearer secret"));

    expect(response.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledWith("/posts/hello");
    expect(revalidatePath).toHaveBeenCalledTimes(2);
  });
});
