import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    if (currentUser.role !== "ADMIN" && currentUser.role !== "ORGANIZER") {
      return NextResponse.json(
        { error: "Ko'ngillilarni taklif qilish uchun etarli huquqlar yo'q" },
        { status: 403 }
      );
    }

    const projectId = params.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Проект не найден" }, { status: 404 });
    }

    const body = await request.json();
    const { userIds, message } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        {
          error:
            "Taklif uchun foydalanuvchilar ro'yxatini ko'rsatishingiz kerak",
        },
        { status: 400 }
      );
    }

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (users.length !== userIds.length) {
      return NextResponse.json(
        { error: "Некоторые пользователи не найдены" },
        { status: 400 }
      );
    }

    const existingInvitations = await prisma.projectInvitation.findMany({
      where: {
        projectId,
        userId: {
          in: userIds,
        },
        status: "PENDING",
      },
      select: {
        userId: true,
      },
    });

    const existingUserIds = existingInvitations.map((inv) => inv.userId);
    const newUserIds = userIds.filter((id) => !existingUserIds.includes(id));

    if (newUserIds.length === 0) {
      return NextResponse.json(
        {
          error:
            "Ushbu foydalanuvchilarning barchasi allaqachon taklif qilingan",
        },
        { status: 400 }
      );
    }

    const invitations = await prisma.$transaction(
      newUserIds.map((userId) =>
        prisma.projectInvitation.create({
          data: {
            userId,
            projectId,
            invitedById: currentUser.id,
            message: message || undefined,
            status: "PENDING",
          },
        })
      )
    );

    return NextResponse.json({
      message: `Taklifnomalar ${invitations.length} foydalanuvchilarga muvaffaqiyatli yuborildi`,
      invitations,
    });
  } catch (error) {
    console.error("Invite volunteers error:", error);
    return NextResponse.json(
      { error: "Ko'ngillilarni taklif qilishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
