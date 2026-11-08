import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.REVALIDATE_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const paths = (body as { paths?: unknown } | null)?.paths;

  if (!Array.isArray(paths) || paths.length === 0 || !paths.every((path) => typeof path === "string")) {
    return NextResponse.json({ message: "paths must be a non-empty string array" }, { status: 422 });
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, paths });
}
