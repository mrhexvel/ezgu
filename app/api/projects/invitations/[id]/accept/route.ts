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

    const invitationId = (await params).id;

    const invitation = await prisma.projectInvitation.findUnique({
      where: {
        id: invitationId,
        userId: currentUser.id,
      },
      include: {
        project: true,
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Taklif topilmadi" }, { status: 404 });
    }

    if (invitation.status !== "PENDING") {
      return NextResponse.json(
        { error: "Taklif allaqachon qayta ishlangan" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.projectInvitation.update({
        where: { id: invitationId },
        data: { status: "ACCEPTED" },
      });

      const existingParticipant = await tx.projectParticipant.findFirst({
        where: {
          projectId: invitation.projectId,
          userId: currentUser.id,
        },
      });

      if (!existingParticipant) {
        await tx.projectParticipant.create({
          data: {
            projectId: invitation.projectId,
            userId: currentUser.id,
            status: "CONFIRMED",
            invitedById: invitation.invitedById,
          },
        });
      } else {
        await tx.projectParticipant.update({
          where: { id: existingParticipant.id },
          data: { status: "CONFIRMED" },
        });
      }
    });

    return NextResponse.json({
      message: `"${invitation.project.title}" loyihasiga taklif qabul qilindi`,
    });
  } catch (error) {
    console.error("Accept invitation error:", error);
    return NextResponse.json(
      { error: "Taklifni qabul qilishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
