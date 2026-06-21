import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  archiveProject,
  updateUATItem,
  updateBug,
  updateTask,
} from "@/lib/db/store";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const projectId = request.nextUrl.searchParams.get("id");

    if (projectId) {
      const project = await getProject(projectId, user.id);
      if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ project });
    }

    const projects = await getProjects(user.id);
    return NextResponse.json({ projects });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await request.json();

    const project = await createProject(user.id, {
      name: body.name,
      description: body.description,
      product_type: body.product_type,
      stage: body.stage,
      selected_tool: body.selected_tool,
      target_audience: body.target_audience,
      goal: body.goal,
      website_url: body.website_url ?? null,
      github_url: body.github_url ?? null,
    });

    return NextResponse.json({ project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await request.json();
    const { projectId, action, ...updates } = body;

    if (action === "archive") {
      await archiveProject(projectId, user.id);
      return NextResponse.json({ success: true });
    }

    if (action === "update_uat") {
      const uat = await updateUATItem(updates.uatId, projectId, updates.data, updates.remark);
      return NextResponse.json({ uat });
    }

    if (action === "update_bug") {
      const bug = await updateBug(updates.bugId, projectId, updates.data);
      return NextResponse.json({ bug });
    }

    if (action === "update_task") {
      const task = await updateTask(updates.taskId, projectId, updates.data);
      return NextResponse.json({ task });
    }

    const project = await updateProject(projectId, user.id, updates);
    return NextResponse.json({ project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
