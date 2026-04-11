import { Geist, Geist_Mono, Noto_Sans_Bengali, Tiro_Bangla } from "next/font/google";

export const notoBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

/** Editorial / masthead Bangla — loaded as a CSS variable on `<html>`; use `.font-tiro-bangla` in CSS. */
export const tiroBangla = Tiro_Bangla({
  variable: "--font-tiro-bangla",
  subsets: ["bengali", "latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
