import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { arrayToJson, jsonToArray } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Avtorizatsiya qilinmagan" },
        { status: 401 }
      );
    }

    const userId = (await params).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        location: true,
        interests: true,
        hours: true,
        level: true,
        createdAt: true,
        projects: {
          select: {
            id: true,
            status: true,
            hours: true,
            project: {
              select: {
                id: true,
                title: true,
                slug: true,
                image: true,
                location: true,
                startDate: true,
                endDate: true,
                status: true,
                description: true,
                category: true,
                participants: true,
              },
            },
          },
        },
        achievements: {
          select: {
            awardedAt: true,
            achievement: {
              select: {
                id: true,
                title: true,
                description: true,
                icon: true,
                color: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Foydalanuvchi topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        ...user,
        interests: user.interests ? jsonToArray(user.interests as string) : [],
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Foydalanuvchi ma'lumotlarini olishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Avtorizatsiya qilinmagan" },
        { status: 401 }
      );
    }

    const userId = params.id;

    if (currentUser.role !== "ADMIN" && currentUser.id !== userId) {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 });
    }

    const body = await request.json();
    const { name, bio, location, interests, avatar } = body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        location,
        interests: interests ? arrayToJson(interests) : undefined,
        avatar,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        location: true,
        interests: true,
        hours: true,
        level: true,
      },
    });

    return NextResponse.json({
      message: "Foydalanuvchi ma'lumotlari muvaffaqiyatli yangilandi",
      user: {
        ...user,
        interests: user.interests ? jsonToArray(user.interests as string) : [],
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Foydalanuvchi ma'lumotlarini yangilashda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 });
    }

    const userId = params.id;

    if (currentUser.id === userId) {
      return NextResponse.json(
        { error: "O'z hisobingizni o'chira olmaysiz" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      message: "Foydalanuvchi muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Foydalanuvchini o'chirishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
