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
  createTask,
  deleteTask,
  createUATItem,
  deleteUATItem,
  createBug,
  deleteBug,
  createEnhancement,
  updateEnhancement,
  deleteEnhancement,
  createPhase,
  updatePhase,
  deletePhase,
  ensureProfile,
  applyApprovedSuggestions,
  saveAiSuggestions,
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
    await ensureProfile(user);
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

    if (projectId && action) {
      const owned = await getProject(projectId, user.id);
      if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

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

    if (action === "create_task") {
      const task = await createTask(projectId, updates.data);
      return NextResponse.json({ task });
    }
    if (action === "delete_task") {
      await deleteTask(updates.taskId, projectId);
      return NextResponse.json({ success: true });
    }
    if (action === "create_uat") {
      const uat = await createUATItem(projectId, updates.data);
      return NextResponse.json({ uat });
    }
    if (action === "delete_uat") {
      await deleteUATItem(updates.uatId, projectId);
      return NextResponse.json({ success: true });
    }
    if (action === "create_bug") {
      const bug = await createBug(projectId, updates.data);
      return NextResponse.json({ bug });
    }
    if (action === "delete_bug") {
      await deleteBug(updates.bugId, projectId);
      return NextResponse.json({ success: true });
    }
    if (action === "create_enhancement") {
      const enhancement = await createEnhancement(projectId, updates.data);
      return NextResponse.json({ enhancement });
    }
    if (action === "update_enhancement") {
      const enhancement = await updateEnhancement(updates.enhancementId, projectId, updates.data);
      return NextResponse.json({ enhancement });
    }
    if (action === "delete_enhancement") {
      await deleteEnhancement(updates.enhancementId, projectId);
      return NextResponse.json({ success: true });
    }
    if (action === "create_phase") {
      const phase = await createPhase(projectId, updates.data);
      return NextResponse.json({ phase });
    }
    if (action === "update_phase") {
      const phase = await updatePhase(updates.phaseId, projectId, updates.data);
      return NextResponse.json({ phase });
    }
    if (action === "delete_phase") {
      await deletePhase(updates.phaseId, projectId);
      return NextResponse.json({ success: true });
    }
    if (action === "apply_suggestions") {
      const result = await applyApprovedSuggestions(projectId, updates.suggestions ?? []);
      return NextResponse.json(result);
    }
    if (action === "save_suggestions") {
      const suggestions = await saveAiSuggestions(projectId, updates.suggestions ?? []);
      return NextResponse.json({ suggestions });
    }

    const project = await updateProject(projectId, user.id, updates);
    return NextResponse.json({ project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
