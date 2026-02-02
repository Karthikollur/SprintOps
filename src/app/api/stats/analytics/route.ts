import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const teamId = session.user.teamId;

    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "week";

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "month":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        break;
      case "week":
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
    }

    // Get all tasks completed in the period
    const completedTasks = await prisma.task.findMany({
      where: {
        teamId,
        status: "DONE",
        updatedAt: {
          gte: startDate,
        },
      },
      select: {
        updatedAt: true,
      },
    });

    // Get all bugs created and fixed in the period
    const bugs = await prisma.bug.findMany({
      where: {
        teamId,
        OR: [
          { createdAt: { gte: startDate } },
          { updatedAt: { gte: startDate }, status: "FIXED" },
        ],
      },
      select: {
        createdAt: true,
        updatedAt: true,
        status: true,
      },
    });

    // Get sprint progress data (cumulative completion over time)
    const allTasks = await prisma.task.findMany({
      where: { teamId },
      select: {
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Group by day
    const days: string[] = [];
    const tasksCompletedPerDay: number[] = [];
    const bugsOpenedPerDay: number[] = [];
    const bugsFixedPerDay: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dayStr = date.toLocaleDateString("en-US", { weekday: "short" });
      days.push(dayStr);

      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      // Count tasks completed on this day
      const completedOnDay = completedTasks.filter((t) => {
        const updated = new Date(t.updatedAt);
        return updated >= dayStart && updated <= dayEnd;
      }).length;
      tasksCompletedPerDay.push(completedOnDay);

      // Count bugs opened and fixed on this day
      const openedOnDay = bugs.filter((b) => {
        const created = new Date(b.createdAt);
        return created >= dayStart && created <= dayEnd;
      }).length;
      bugsOpenedPerDay.push(openedOnDay);

      const fixedOnDay = bugs.filter((b) => {
        if (b.status !== "FIXED") return false;
        const updated = new Date(b.updatedAt);
        return updated >= dayStart && updated <= dayEnd;
      }).length;
      bugsFixedPerDay.push(fixedOnDay);
    }

    // Calculate cumulative sprint progress
    const totalTasks = allTasks.length;
    const sprintProgress: number[] = [];
    let cumulativeDone = 0;

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      date.setHours(23, 59, 59, 999);

      const doneByDate = allTasks.filter((t) => {
        if (t.status !== "DONE") return false;
        return new Date(t.updatedAt) <= date;
      }).length;

      cumulativeDone = doneByDate;
      const progress = totalTasks > 0 ? Math.round((cumulativeDone / totalTasks) * 100) : 0;
      sprintProgress.push(progress);
    }

    return NextResponse.json({
      days,
      tasksCompletedPerDay,
      bugsOpenedPerDay,
      bugsFixedPerDay,
      sprintProgress,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
