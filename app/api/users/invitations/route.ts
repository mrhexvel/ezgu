import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const invitations = await prisma.projectInvitation.findMany({
      where: {
        userId: currentUser.id,
        status: "PENDING",
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
            image: true,
            startDate: true,
            endDate: true,
            status: true,
            category: {
              select: {
                name: true,
                color: true,
                icon: true,
              },
            },
          },
        },
        invitedBy: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error("Get user invitations error:", error);
    return NextResponse.json(
      { error: "Произошла ошибка при получении приглашений" },
      { status: 500 }
    );
  }
}
