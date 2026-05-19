'use client'

import { useState, useEffect } from 'react'
import { BootSequence } from '@/components/BootSequence'
import { Nav } from '@/components/Nav'
import { HeroSection } from '@/components/HeroSection'
import { SpecsSection } from '@/components/SpecsSection'
import { PatchNotesSection } from '@/components/PatchNotesSection'
import { CompatibilityTest } from '@/components/CompatibilityTest'
import { DiagnosticSection } from '@/components/DiagnosticSection'
import { ChatSection } from '@/components/ChatSection'
import { ReviewsSection } from '@/components/ReviewsSection'
import { Footer } from '@/components/Footer'
import { SectionNavigation } from '@/components/SectionNavigation'
import { EasterEgg } from '@/components/EasterEgg'
import { SunflowerDecoration } from '@/components/SunflowerDecoration'
import { motion } from 'framer-motion'

export default function Home() {
  const [bootDone, setBootDone] = useState(false)
  const [showEasterEgg, setShowEasterEgg] = useState(false)

  useEffect(() => {
    console.log('// salve developer. niente da decompilare qui. 🌻')
  }, [])

  useEffect(() => {
    const sequence = ['B', 'O', 'T']
    let index = 0
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === sequence[index]) {
        index++
        if (index === sequence.length) {
          setShowEasterEgg(true)
          index = 0
        }
      } else {
        index = e.key === sequence[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <>
      <BootSequence onComplete={() => setBootDone(true)} />
      {bootDone && (
        <main className="bg-paper min-h-screen pb-24">
          <Nav />
          <HeroSection />
          <SpecsSection />
          <PatchNotesSection />
          <CompatibilityTest />
          <DiagnosticSection />
          <ChatSection />
          <ReviewsSection />
          <Footer />
          <SectionNavigation />
        </main>
      )}
      {/* Fixed rotating sunflower — bottom-right, stesso livello del nav pill */}
      {bootDone && (
        <motion.div
          className="fixed bottom-5 right-5 z-50 pointer-events-none select-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          <SunflowerDecoration size={44} opacity={0.7} />
        </motion.div>
      )}
      {showEasterEgg && <EasterEgg onClose={() => setShowEasterEgg(false)} />}
    </>
  )
}
