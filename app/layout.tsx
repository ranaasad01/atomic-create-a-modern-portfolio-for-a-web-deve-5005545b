import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocaleProvider from "@/components/LocaleProvider";
import LanguageToggle from "@/components/LanguageToggle";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  formatDetection: { telephone: false, date: false, email: false, address: false },
  title: "Alex Chen — Full-Stack Developer",
  description:
    "Portfolio of Alex Chen, a full-stack developer crafting immersive digital experiences with modern web technologies.",
  keywords: ["web developer", "full-stack", "portfolio", "React", "Next.js", "TypeScript"],
  authors: [{ name: "Alex Chen" }],
  openGraph: {
    title: "Alex Chen — Full-Stack Developer",
    description: "Crafting immersive digital experiences with modern web technologies.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-[#0f0f0f] text-white antialiased overflow-x-hidden">
        <LocaleProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <LanguageToggle />
        </LocaleProvider>
      </body>
    </html>
  );
}