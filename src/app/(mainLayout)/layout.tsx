import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "../../app/globals.css"
import { ThemeProvider } from "@/components/ThemeProvider/theme-provider"
import Navbar from "@/components/HomePage/Navbar"
import Footer from "@/components/HomePage/Footer"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "BitSwapix | Next Gen AI Cryptohub",
  description:
    "The utility token behind BitSwapix — a modular hub where AI, fintech, and Web3 converge. Explore the next evolution of digital finance.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
