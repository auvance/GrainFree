import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import Header from "@/components/layout/Header"
// import Footer from "@/components/layout/Footer" // if you've built this

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "GrainFree",
  description: "Find gluten-free meals, track your diet, and plan smarter",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#FAFAF5] text-black`}>
        
        <main className="min-h-screen">{children}</main>
        {/* Optional: <Footer /> */}
      </body>
    </html>
  )
}
