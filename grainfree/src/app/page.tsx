'use client'

import Button from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
      <h1 className="text-3xl font-bold mb-4 text-black">Yessir Next.js ✈️🏢</h1>

      <Button onClick={() => alert('Primary clicked!')}>Button Primary</Button>
      <Button variant="secondary" onClick={() => alert('Secondary clicked!')}>
        Button Secondary
      </Button>
    </main>
  )
}
