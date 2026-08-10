import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["cyrillic", "latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["cyrillic", "latin"],
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;

  return {
    metadataBase: new URL(baseUrl),
    title: "Mareva — поиск отелей в Турции",
    description: "Независимый поиск отелей, апарт-отелей и вилл в Турции с переходом к источнику бронирования.",
    icons: { icon: "/favicon.png", apple: "/mareva-icon.png" },
    openGraph: {
      title: "Mareva — Турция без переплаты",
      description: "Независимый поиск жилья в Турции.",
      images: [{ url: `${baseUrl}/og.png`, width: 1200, height: 630, alt: "Mareva — Турция без переплаты" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Mareva — Турция без переплаты",
      description: "Независимый поиск жилья в Турции.",
      images: [`${baseUrl}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={`${manrope.variable} ${playfair.variable}`}>{children}</body>
    </html>
  );
}
