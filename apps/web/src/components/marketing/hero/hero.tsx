import { ArrowRight } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Badge,
  ButtonLink,
  Container,
  GradientText,
  StatusDot,
  buttonVariants,
} from '@observo/ui'

import { Reveal } from '#/components/animations/reveal'
import { stats } from '#/data/stats'

const LogExplorer = lazy(() =>
  import('./log-explorer').then((m) => ({ default: m.LogExplorer })),
)

function LogExplorerFallback() {
  return (
    <div
      className="surface-card h-[320px] w-full overflow-hidden rounded-2xl border border-border sm:h-[360px]"
      aria-hidden
    />
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 md:pt-40 lg:pt-44">
      <div
        aria-hidden
        className="bg-hero-depth pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden
        className="bg-grid-faint pointer-events-none absolute inset-0"
      />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal mode="rise" immediate y={10}>
            <Badge variant="iris" className="mb-8">
              <StatusDot tone="iris" pulse />
              v1.0 is now live
            </Badge>
          </Reveal>

          <Reveal mode="rise" immediate delay={0.08} y={14}>
            <h1 className="text-[2.75rem] leading-[1.06] font-medium tracking-tightest text-balance sm:text-6xl md:text-[4.25rem]">
              <GradientText>Know what broke —</GradientText>
              <br />
              <GradientText variant="iris">
                in seconds, not dashboards.
              </GradientText>
            </h1>
          </Reveal>

          <Reveal mode="rise" immediate delay={0.16} y={12}>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-pretty text-ink-300 md:text-xl">
              Observability that sets up like a side project and scales like
              infrastructure. Errors, requests, and performance in one place —
              streaming in under a minute.
            </p>
          </Reveal>

          <Reveal mode="rise" immediate delay={0.24} y={10}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
              <Link to="/sign-up" className={buttonVariants({ size: 'lg' })}>
                Get started
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <ButtonLink href="#pricing" variant="secondary" size="lg">
                View pricing
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal mode="rise" immediate delay={0.32} y={8}>
            <p className="mt-7 text-xs text-ink-500">
              free for side projects · no credit card required
            </p>
          </Reveal>
        </div>

        <Reveal
          mode="rise"
          immediate
          delay={0.28}
          y={20}
          className="relative mx-auto mt-16 max-w-4xl md:mt-20"
        >
          <div
            aria-hidden
            className="absolute -inset-x-8 -top-12 -bottom-16 rounded-[3rem] bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,var(--glow-iris-soft),transparent_70%)]"
          />
          <Suspense fallback={<LogExplorerFallback />}>
            <LogExplorer />
          </Suspense>

          <div className="surface-glass absolute -right-5 -bottom-6 hidden items-center gap-3 rounded-xl px-4 py-3 lg:flex">
            <span className="flex size-8 items-center justify-center rounded-lg bg-success/10 text-success">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
              >
                <path
                  d="M7 1v5l3 2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="7"
                  cy="7"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-50">
                {stats.searchP99Ms}ms
              </p>
              <p className="text-2xs text-ink-400">p99 query latency</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
