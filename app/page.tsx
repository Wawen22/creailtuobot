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
import { SectionTransition } from '@/components/SectionTransition'
import { EasterEgg } from '@/components/EasterEgg'
import { SectionNavigation } from '@/components/SectionNavigation'

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
          <SectionTransition command="cat specs.yaml" nextSectionId="specs" />
          <SpecsSection />
          <SectionTransition command="cat patch_notes.md" nextSectionId="patches" />
          <PatchNotesSection />
          <SectionTransition command="./run_compatibility_test.sh" nextSectionId="compatibility" />
          <CompatibilityTest />
          <SectionTransition command="sudo bot-diagnostic --help" nextSectionId="diagnostic" />
          <DiagnosticSection />
          <SectionTransition command="./open_chat.sh --bot=ana_bot" nextSectionId="chat" />
          <ChatSection />
          <SectionTransition command="cat reviews.json | jq '.[]'" nextSectionId="reviews" />
          <ReviewsSection />
          <Footer />
          <SectionNavigation />
        </main>
      )}
      {showEasterEgg && <EasterEgg onClose={() => setShowEasterEgg(false)} />}
    </>
  )
}
