import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { z } from "zod";

const createBugSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  severity: z.enum(["LOW", "MEDIUM", "CRITICAL"]).default("MEDIUM"),
  status: z.enum(["OPEN", "FIXED"]).default("OPEN"),
  linkedTaskId: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const session = await requireAuth();

    const bugs = await prisma.bug.findMany({
      where: { teamId: session.user.teamId },
      include: {
        linkedTask: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bugs);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get bugs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bugs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const validated = createBugSchema.parse(body);

    const bug = await prisma.bug.create({
      data: {
        title: validated.title,
        description: validated.description,
        severity: validated.severity,
        status: validated.status,
        linkedTaskId: validated.linkedTaskId || null,
        teamId: session.user.teamId,
      },
      include: {
        linkedTask: {
          select: { id: true, title: true },
        },
      },
    });

    return NextResponse.json(bug, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Create bug error:", error);
    return NextResponse.json(
      { error: "Failed to create bug" },
      { status: 500 }
    );
  }
}
