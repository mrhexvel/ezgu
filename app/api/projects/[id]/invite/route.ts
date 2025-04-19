import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Avtorizatsiyadan o'tilmagan" },
        { status: 401 }
      );
    }

    if (currentUser.role !== "ADMIN" && currentUser.role !== "ORGANIZER") {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 });
    }

    const projectId = (await params).id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Loyiha topilmadi" }, { status: 404 });
    }

    const body = await request.json();
    const { userIds } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "Foydalanuvchilar ro'yxati ko'rsatilishi kerak" },
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
        { error: "Ba'zi foydalanuvchilar topilmadi" },
        { status: 400 }
      );
    }

    const existingParticipants = await prisma.projectParticipant.findMany({
      where: {
        projectId,
        userId: {
          in: userIds,
        },
      },
      select: {
        userId: true,
      },
    });

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

    const existingUserIds = existingParticipants.map((p) => p.userId);
    const existingInvitationUserIds = existingInvitations.map((i) => i.userId);

    const newUserIds = userIds.filter(
      (id) =>
        !existingUserIds.includes(id) && !existingInvitationUserIds.includes(id)
    );

    if (newUserIds.length === 0) {
      return NextResponse.json(
        {
          error:
            "Barcha ko'rsatilgan foydalanuvchilar allaqachon taklif qilingan",
        },
        { status: 400 }
      );
    }

    const invitations = await prisma.$transaction(async (tx) => {
      const createdInvitations = [];

      for (const userId of newUserIds) {
        const invitation = await tx.projectInvitation.create({
          data: {
            projectId,
            userId,
            invitedById: currentUser.id,
            status: "PENDING",
            message: `Sizni "${project.title}" loyihasiga taklif qilamiz.`,
          },
        });

        createdInvitations.push(invitation);
      }

      return createdInvitations;
    });

    return NextResponse.json({
      message: `Takliflar ${invitations.length} foydalanuvchiga muvaffaqiyatli yuborildi`,
      invitations,
    });
  } catch (error) {
    console.error("Invite volunteers error:", error);
    return NextResponse.json(
      { error: "Taklifni yuborishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
