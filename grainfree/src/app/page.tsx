'use client'
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

import Button from '@/components/ui/button'

export default function HomePage() {
  return (
  
    <main className="min-h-screen bg-[#FAFAF5]">
      <Header/>
      <h1 className="text-3xl font-bold mb-4 text-black">Yessir Next.js ✈️🏢</h1>

      <Button onClick={() => alert('Primary clicked!')}>Button Primary</Button>
        <Button variant="secondary" onClick={() => alert('Secondary clicked!')}>
          Button Secondary
        </Button>
      <Footer/>
      
    </main>
  )
}
