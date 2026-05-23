import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "LCK All-Pro Voter (LCK 올프로 투표기)",
  description: "Select LCK 2026 Season All-Pro 1st, 2nd, and 3rd teams, and vote for MVP/Rookie of the Split. / LCK 2026 시즌의 올프로 팀 및 MVP, 루키를 선정해 보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased min-h-screen text-slate-100 font-sans selection:bg-amber-500/30">
        {children}
      </body>
    </html>
  );
}
