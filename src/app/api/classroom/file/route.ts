import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getMembershipAccess } from "@/lib/auth/membership";
import { safeClassroomPath } from "@/lib/classroom/media";
import { createClassroomSignedUrl } from "@/lib/classroom/storage";

export async function GET(request: NextRequest) {
  try {
    const raw = request.nextUrl.searchParams.get("path") || "";
    const download = request.nextUrl.searchParams.get("download") === "1";
    const path = safeClassroomPath(raw);
    if (!path) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const isCover = path.startsWith("covers/");
    if (!isCover) {
      const { user, isAuthenticated } = await getSession();
      if (!isAuthenticated || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const access = await getMembershipAccess(user.email, user.isAdmin);
      if (!access.paid) {
        return NextResponse.json({ error: "Paid membership required" }, { status: 403 });
      }
    }

    const signedUrl = await createClassroomSignedUrl(path, download);
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
