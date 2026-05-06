import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Spend Audit - Find Hidden Savings in Your AI Tool Stack",
  description: "Free audit tool that analyzes your AI tool spending and finds opportunities to save thousands per year. Get instant recommendations for Cursor, Claude, ChatGPT, and more.",
  openGraph: {
    title: "AI Spend Audit - Find Hidden Savings in Your AI Tool Stack",
    description: "Free audit tool that analyzes your AI tool spending and finds opportunities to save thousands per year.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Spend Audit - Find Hidden Savings in Your AI Tool Stack",
    description: "Free audit tool that analyzes your AI tool spending and finds opportunities to save thousands per year.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
