import CoffeeSection from "@/app/components/coffee-section";
import Hero from "@/app/components/hero";
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <Hero />
        <CoffeeSection />
      </main>
    </div>
  )
}

