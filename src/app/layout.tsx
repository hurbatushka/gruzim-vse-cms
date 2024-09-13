import type { Metadata } from "next";
import { Yanone_Kaffeesatz } from "next/font/google";
import "./globals.css";

const yanone = Yanone_Kaffeesatz({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Грузим всё | Платформа",
  icons: {
    icon: "/logo_cube.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={yanone.className}>{children}</body>
    </html>
  );
}
