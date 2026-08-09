import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider/theme-provider";
import { ReduxProvider } from "@/redux/provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ieltszenai.pro"),
  title: {
    default: "IELTSZen AI — AI-Powered IELTS Preparation",
    template: "%s | IELTSZen AI",
  },
  description:
    "Personalized mock exams, instant AI band scoring, and smart performance tracking for Listening, Reading, Writing and Speaking — everything you need to hit your target IELTS score.",
  openGraph: {
    title: "IELTSZen AI — AI-Powered IELTS Preparation",
    description:
      "Personalized mock exams, instant AI band scoring, and smart performance tracking to help you hit your target IELTS score.",
    url: "https://www.ieltszenai.pro",
    siteName: "IELTSZen AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IELTSZen AI — AI-Powered IELTS Preparation",
    description:
      "Personalized mock exams, instant AI band scoring, and smart performance tracking to help you hit your target IELTS score.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster/>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
