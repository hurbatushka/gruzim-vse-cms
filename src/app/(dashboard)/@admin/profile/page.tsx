"use client";
import { useState, useEffect } from "react";

export default function UploadPage() {
  const [image, setImage] = useState<File | null>(null);
  const [imageType, setImageType] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "saving" | "completed" | "error"
  >("idle");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);

      // Создание миниатюры изображения
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      setImage(null);
      setImagePreview(null); // Очистка миниатюры, если файл не выбран
    }
  };

  const handleImageTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageType(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image || !imageType) {
      setMessage("Файл изображения и тип изображения обязательны");
      return;
    }

    setUploadStatus("uploading");

    try {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        const response = await fetch("/api/image/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64Image,
            imageType,
            description,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setUploadStatus("completed");
          setMessage(`Изображение успешно загружено: ${result.message}`);
          // Очистка полей
          setImage(null);
          setImageType("");
          setDescription("");
          setImagePreview(null); // Очистка миниатюры
          // Очистка сообщения через 5 секунд
          setTimeout(() => setMessage(""), 5000);
        } else {
          setUploadStatus("error");
          setMessage(`Ошибка: ${result.message}`);
        }
      };
    } catch (error) {
      setUploadStatus("error");
      setMessage("Произошла ошибка при загрузке изображения.");
      console.error("Ошибка при загрузке изображения:", error);
    }
  };

  useEffect(() => {
    if (uploadStatus === "completed" || uploadStatus === "error") {
      const timer = setTimeout(() => setUploadStatus("idle"), 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen ">
      <div className=" w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl text-current font-bold">
            Загрузка изображения
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="relative">
            <label className="block text-lg font-medium">Изображение:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <button
              type="button"
              className="w-full px-4 py-3 text-2xl rounded-xl bg-current-black text-current-light hover:text-white transition-colors font-bold hover:bg-[#323232] bg-[#bfa156] focus:outline-none focus:ring-2 focus:ring-[#bfa156]"
            >
              {image ? `Выбран: ${image.name}` : "Выберите файл"}
            </button>
          </div>
          {imagePreview && (
            <div className="mt-4 text-center flex justify-center">
              <img
                src={imagePreview}
                alt="Image preview"
                className="max-w-full h-auto rounded-md border border-gray-300"
                style={{
                  maxWidth: "50%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </div>
          )}
          <div>
            <label className="block text-lg font-medium">
              Тип изображения:
            </label>
            <input
              type="text"
              value={imageType}
              onChange={handleImageTypeChange}
              className="mt-2 px-4 py-2 rounded-md bg-current-black text-current-light focus:outline-none focus:ring-2 focus:ring-[#dbc58] border"
            />
          </div>
          <div>
            <label className="block text-lg font-medium">Описание:</label>
            <input
              type="text"
              value={description}
              onChange={handleDescriptionChange}
              className="mt-2 px-4 py-2 rounded-md bg-current-black text-current-light focus:outline-none focus:ring-2 focus:ring-[#dbc58] border"
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-3 text-2xl rounded-xl bg-current-black text-current-light hover:text-white transition-colors font-bold hover:bg-[#323232] bg-[#bfa156] focus:outline-none focus:ring-2 focus:ring-[#bfa156] ${
              !image ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!image}
          >
            Загрузить
          </button>
        </form>
        {uploadStatus === "uploading" && (
          <div className="mt-4 text-center">
            <p className="text-yellow-500">Идёт загрузка на сервер...</p>
            <div className="w-full bg-gray-200 rounded-full mt-2">
              <div className="bg-yellow-500 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
        {uploadStatus === "saving" && (
          <div className="mt-4 text-center">
            <p className="text-blue-500">Сохранение в базу данных...</p>
            <div className="w-full bg-gray-200 rounded-full mt-2">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
        {uploadStatus === "completed" && (
          <p className="mt-4 text-center text-green-500">{message}</p>
        )}
        {uploadStatus === "error" && (
          <p className="mt-4 text-center text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
}
