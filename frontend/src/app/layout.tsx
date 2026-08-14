import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "PocketSafar — Your Smart Travel Companion",
    template: "%s | PocketSafar",
  },
  description:
    "Plan trips, write travel diaries, discover local businesses, and explore with AI-powered insights. Your all-in-one travel ecosystem.",
  keywords: [
    "travel",
    "diary",
    "trip planner",
    "travel companion",
    "AI travel",
    "community",
  ],
  authors: [{ name: "PocketSafar Team" }],
  openGraph: {
    title: "PocketSafar — Your Smart Travel Companion",
    description: "Plan trips, write travel diaries, and explore with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
