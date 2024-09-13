import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import useAuth from "@/hooks/useAuth"; // Подключаем хук авторизации

const prisma = new PrismaClient();

// Конфигурация Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const userData: any = await useAuth();

    if (userData.userId) {
      const { image, imageType, description } = await request.json();

      const imageTypeRecord = await prisma.image_types.findUnique({
        where: { type_name: imageType },
      });

      if (!imageTypeRecord) {
        return NextResponse.json(
          { message: "Некорректный тип изображения" },
          { status: 400 }
        );
      }

      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "assets",
      });

      const savedImage = await prisma.images.create({
        data: {
          url: uploadResponse.secure_url,
          user_id: userData.userId,
          type_id: imageTypeRecord.id,
          description: description || "",
        },
      });

      return NextResponse.json(
        { message: "Изображение успешно загружено", savedImage },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "Доступ запрещён" }, { status: 403 });
    }
  } catch (error) {
    console.error("Ошибка при загрузке:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке изображения" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userData: any = await useAuth();

    if (userData.userId && (userData.role === 3 || userData.role === 1)) {
      return NextResponse.json(
        { message: "Доступ разрешен", userData },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "Доступ запрещён" }, { status: 403 });
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    return NextResponse.json(
      { message: "Ошибка при авторизации" },
      { status: 500 }
    );
  }
}
