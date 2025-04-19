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
    const body = await request.json();
    const { participantId, hours, note } = body;

    if (!participantId || typeof hours !== "number" || hours <= 0) {
      return NextResponse.json(
        {
          error:
            "Noto'g'ri ma'lumotlar. Ishtirokchi ID va soatlar talab qilinadi",
        },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Loyiha topilmadi" }, { status: 404 });
    }

    const participant = await prisma.projectParticipant.findUnique({
      where: { id: participantId },
      include: { user: true },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Ishtirokchi topilmadi" },
        { status: 404 }
      );
    }

    if (participant.projectId !== projectId) {
      return NextResponse.json(
        { error: "Ishtirokchi bu loyihaga tegishli emas" },
        { status: 400 }
      );
    }

    const updatedParticipant = await prisma.$transaction(async (tx) => {
      const updated = await tx.projectParticipant.update({
        where: { id: participantId },
        data: {
          hours: participant.hours + hours,
          status: "COMPLETED",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              hours: true,
            },
          },
        },
      });

      await tx.user.update({
        where: { id: participant.userId },
        data: {
          hours: { increment: hours },
        },
      });

      await tx.hoursLog.create({
        data: {
          userId: participant.userId,
          projectId,
          hours,
          note: note || `${currentUser.name} tomonidan qo'shilgan soatlar`,
          awardedById: currentUser.id,
        },
      });

      return updated;
    });

    return NextResponse.json({
      message: "Soatlar muvaffaqiyatli qo'shildi",
      participant: updatedParticipant,
    });
  } catch (error) {
    console.error("Add hours error:", error);
    return NextResponse.json(
      { error: "Soatlarni qo'shishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}

export async function GET(
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

    const projectId = (await params).id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Loyiha topilmadi" }, { status: 404 });
    }

    const where = {
      projectId,
      ...(userId ? { userId } : {}),
    };

    const hoursLogs = await prisma.hoursLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        awardedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ hoursLogs });
  } catch (error) {
    console.error("Get hours logs error:", error);
    return NextResponse.json(
      { error: "Soatlar jurnalini olishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
