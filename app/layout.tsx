import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { NavWrapper } from "@/components/layout/NavWrapper";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YouTube Notes — Turn Videos Into Knowledge",
  description: "Use AI to turn YouTube videos into clear summaries, structured notes, key takeaways and actionable insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="flex flex-col bg-background text-foreground">
        <SmoothScroll>
          <NavWrapper />
          {children}
        </SmoothScroll>
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
