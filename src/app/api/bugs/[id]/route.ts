import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { z } from "zod";

const updateBugSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  severity: z.enum(["LOW", "MEDIUM", "CRITICAL"]).optional(),
  status: z.enum(["OPEN", "FIXED"]).optional(),
  linkedTaskId: z.string().optional().nullable(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const bug = await prisma.bug.findFirst({
      where: { id, teamId: session.user.teamId },
      include: {
        linkedTask: {
          select: { id: true, title: true },
        },
      },
    });

    if (!bug) {
      return NextResponse.json({ error: "Bug not found" }, { status: 404 });
    }

    return NextResponse.json(bug);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get bug error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bug" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const validated = updateBugSchema.parse(body);

    const existingBug = await prisma.bug.findFirst({
      where: { id, teamId: session.user.teamId },
    });

    if (!existingBug) {
      return NextResponse.json({ error: "Bug not found" }, { status: 404 });
    }

    const bug = await prisma.bug.update({
      where: { id },
      data: {
        ...(validated.title && { title: validated.title }),
        ...(validated.description !== undefined && { description: validated.description }),
        ...(validated.severity && { severity: validated.severity }),
        ...(validated.status && { status: validated.status }),
        ...(validated.linkedTaskId !== undefined && { linkedTaskId: validated.linkedTaskId }),
      },
      include: {
        linkedTask: {
          select: { id: true, title: true },
        },
      },
    });

    return NextResponse.json(bug);
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
    console.error("Update bug error:", error);
    return NextResponse.json(
      { error: "Failed to update bug" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const existingBug = await prisma.bug.findFirst({
      where: { id, teamId: session.user.teamId },
    });

    if (!existingBug) {
      return NextResponse.json({ error: "Bug not found" }, { status: 404 });
    }

    await prisma.bug.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Bug deleted" });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete bug error:", error);
    return NextResponse.json(
      { error: "Failed to delete bug" },
      { status: 500 }
    );
  }
}
