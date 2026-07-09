import { createFileRoute } from '@tanstack/react-router'

import { Footer } from '#/components/marketing/footer'
import { Header } from '#/components/marketing/header'
import { Hero } from '#/components/marketing/hero/hero'
import { Comparison } from '#/components/marketing/sections/comparison'
import { Cta } from '#/components/marketing/sections/cta'
import { DeveloperExperience } from '#/components/marketing/sections/developer-experience'
import { Faq } from '#/components/marketing/sections/faq'
import { Features } from '#/components/marketing/sections/features/features'
import { Metrics } from '#/components/marketing/sections/metrics'
import { Performance } from '#/components/marketing/sections/performance'
import { Pipeline } from '#/components/marketing/sections/pipeline'
import { Pricing } from '#/components/marketing/sections/pricing'
import { Testimonials } from '#/components/marketing/sections/testimonials'
import { TrustedBy } from '#/components/marketing/sections/trusted-by'
import { Why } from '#/components/marketing/sections/why'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustedBy />
        <Metrics />
        <Why />
        <Features />
        <Pipeline />
        <DeveloperExperience />
        <Performance />
        <Testimonials />
        <Comparison />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  )
}
