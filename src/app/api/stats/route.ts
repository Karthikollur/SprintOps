import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET() {
  try {
    const session = await requireAuth();
    const teamId = session.user.teamId;

    // Get task counts
    const taskCounts = await prisma.task.groupBy({
      by: ["status"],
      where: { teamId },
      _count: { status: true },
    });

    const activeTasks = taskCounts
      .filter((t) => t.status === "TODO" || t.status === "IN_PROGRESS")
      .reduce((sum, t) => sum + t._count.status, 0);

    const blockedTasks = taskCounts
      .filter((t) => t.status === "BLOCKED")
      .reduce((sum, t) => sum + t._count.status, 0);

    const doneTasks = taskCounts
      .filter((t) => t.status === "DONE")
      .reduce((sum, t) => sum + t._count.status, 0);

    const totalTasks = taskCounts.reduce((sum, t) => sum + t._count.status, 0);
    const sprintCompletion = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    // Get bug counts
    const bugCounts = await prisma.bug.groupBy({
      by: ["status"],
      where: { teamId },
      _count: { status: true },
    });

    const openBugs = bugCounts
      .filter((b) => b.status === "OPEN")
      .reduce((sum, b) => sum + b._count.status, 0);

    // Get recent blockers
    const recentBlockers = await prisma.task.findMany({
      where: {
        teamId,
        status: "BLOCKED",
      },
      select: {
        id: true,
        title: true,
        blockReason: true,
        blockedAt: true,
        assignedTo: {
          select: { name: true },
        },
      },
      orderBy: { blockedAt: "desc" },
      take: 3,
    });

    // Get tasks due this week
    const now = new Date();
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    const tasksDueThisWeek = await prisma.task.findMany({
      where: {
        teamId,
        status: { not: "DONE" },
        dueDate: {
          lte: endOfWeek,
        },
      },
      select: {
        id: true,
        title: true,
        priority: true,
        dueDate: true,
      },
      orderBy: { dueDate: "asc" },
      take: 5,
    });

    return NextResponse.json({
      activeTasks,
      blockedTasks,
      openBugs,
      sprintCompletion,
      totalTasks,
      doneTasks,
      recentBlockers,
      tasksDueThisWeek,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
