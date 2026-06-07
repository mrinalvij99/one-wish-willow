import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
  display: "swap",
});

export const metadata: Metadata = {
  title: "One Wish Willow",
  description: "One wish. One consequence.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={vt323.variable}>
      <body className="overflow-hidden bg-[#050505]">{children}</body>
    </html>
  );
}
