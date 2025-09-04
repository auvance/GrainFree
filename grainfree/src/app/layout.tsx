import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "locomotive-scroll/dist/locomotive-scroll.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

import Header from "@/components/layout/Header";
// import Footer from "@/components/layout/Footer" // if you've built this
import AuthWatcher from "@/components/providers/AuthWatcher";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GrainFree",
  description: "Find gluten-free meals, track your diet, and plan smarter",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#FAFAF5] text-black">
        <AuthProvider>
          
          <main className="min-h-screen">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
