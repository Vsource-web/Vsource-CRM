// app/api/students/[id]/fintech-users/route.ts

import { NextRequest } from "next/server";

import db from "@/lib/prisma";
import { ok, handleError } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: studentId } = await params;

    const student = await db.student.findUnique({
      where: {
        id: studentId,
      },
      select: {
        branchId: true,
      },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    const users = await db.user.findMany({
      where: {
        branches: {
          some: {
            id: student.branchId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return ok(users);
  } catch (error) {
    return handleError(error);
  }
}
