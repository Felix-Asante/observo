import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { Footer } from '#/components/marketing/footer'
import { Header } from '#/components/marketing/header'
import { Hero } from '#/components/marketing/hero/hero'

const TrustedBy = lazy(() =>
  import('#/components/marketing/sections/trusted-by').then((m) => ({
    default: m.TrustedBy,
  })),
)
const Metrics = lazy(() =>
  import('#/components/marketing/sections/metrics').then((m) => ({
    default: m.Metrics,
  })),
)
const Why = lazy(() =>
  import('#/components/marketing/sections/why').then((m) => ({
    default: m.Why,
  })),
)
const Features = lazy(() =>
  import('#/components/marketing/sections/features/features').then((m) => ({
    default: m.Features,
  })),
)
const Pipeline = lazy(() =>
  import('#/components/marketing/sections/pipeline').then((m) => ({
    default: m.Pipeline,
  })),
)
const DeveloperExperience = lazy(() =>
  import('#/components/marketing/sections/developer-experience').then((m) => ({
    default: m.DeveloperExperience,
  })),
)
const Performance = lazy(() =>
  import('#/components/marketing/sections/performance').then((m) => ({
    default: m.Performance,
  })),
)
const Testimonials = lazy(() =>
  import('#/components/marketing/sections/testimonials').then((m) => ({
    default: m.Testimonials,
  })),
)
const Comparison = lazy(() =>
  import('#/components/marketing/sections/comparison').then((m) => ({
    default: m.Comparison,
  })),
)
const Pricing = lazy(() =>
  import('#/components/marketing/sections/pricing').then((m) => ({
    default: m.Pricing,
  })),
)
const Faq = lazy(() =>
  import('#/components/marketing/sections/faq').then((m) => ({
    default: m.Faq,
  })),
)
const Cta = lazy(() =>
  import('#/components/marketing/sections/cta').then((m) => ({
    default: m.Cta,
  })),
)

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Suspense fallback={null}>
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
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
