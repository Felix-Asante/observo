import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight, Receipt } from 'lucide-react'
import { ButtonLink, Card, EmptyState } from '@observo/ui'
import { motion, useReducedMotion } from 'motion/react'

import { AreaChart } from '#/components/dashboard/charts/area-chart'
import { ChartCard } from '#/components/dashboard/shared/chart-card'
import { PageHeader } from '#/components/dashboard/shared/page-header'
import { volumeSeries } from '#/data/dashboard/overview'

export const Route = createFileRoute('/(app)/dashboard/usage')({
  head: () => ({ meta: [{ title: 'Usage & billing · Observo' }] }),
  component: UsagePage,
})

const quotas = [
  { label: 'Logs this month', used: '7,482', quota: '10,000', pct: 74 },
  { label: 'API keys', used: '4', quota: '10', pct: 40 },
  { label: 'Storage (compressed)', used: '128 MB', quota: '1 GB', pct: 13 },
] as const

function QuotaBar({ label, used, quota, pct }: (typeof quotas)[number]) {
  const reducedMotion = useReducedMotion()
  const nearLimit = pct >= 70

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm text-ink-200">{label}</span>
        <span className="font-mono text-xs text-ink-500">
          <span className={nearLimit ? 'text-warning' : 'text-ink-200'}>
            {used}
          </span>
          {' / '}
          {quota}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-ink-800/80">
        <motion.div
          initial={reducedMotion ? { width: `${pct}%` } : { width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={
            nearLimit
              ? 'h-full rounded-full bg-gradient-to-r from-warning/70 to-warning'
              : 'h-full rounded-full bg-gradient-to-r from-iris-600 to-iris-400'
          }
        />
      </div>
    </div>
  )
}

function UsagePage() {
  return (
    <>
      <PageHeader
        title="Usage & billing"
        description="Where your ingest quota stands this cycle, and what your plan includes."
        actions={
          <ButtonLink href="/#pricing" size="sm">
            Upgrade plan
            <ArrowUpRight className="size-3.5" aria-hidden />
          </ButtonLink>
        }
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        {/* Plan */}
        <Card className="p-6">
          <p className="label-mono text-ink-600">Current plan</p>
          <p className="mt-2 text-2xl font-medium tracking-tight text-ink-50">
            Free
          </p>
          <p className="mt-1 text-sm text-ink-400">
            10k logs / month · 30-day retention
          </p>
          <ul className="mt-5 space-y-2 border-t border-border-subtle pt-5 font-mono text-xs text-ink-400">
            <li>retention — 30 days (fixed)</li>
            <li>compression — ~10x via ClickHouse</li>
            <li>billing cycle resets — Aug 1, 2026</li>
          </ul>
        </Card>

        {/* Quotas */}
        <Card className="space-y-6 p-6 lg:col-span-2">
          {quotas.map((quota) => (
            <QuotaBar key={quota.label} {...quota} />
          ))}
          <p className="text-xs leading-relaxed text-ink-500">
            You're at 74% of the monthly ingest quota. On the current pace
            you'll hit the limit around Jul 24 — upgrade to Pro for 1M logs a
            month and 90-day retention.
          </p>
        </Card>
      </div>

      <div className="mb-6">
        <ChartCard title="Ingest volume" subtitle="events per hour · last 24h">
          <AreaChart data={volumeSeries} xLabels={['24h ago', 'now']} />
        </ChartCard>
      </div>

      <ChartCard title="Invoices" subtitle="billing history">
        <EmptyState
          icon={<Receipt className="size-5" aria-hidden />}
          title="No invoices yet"
          description="You're on the Free plan. Invoices will appear here once you upgrade to a paid plan."
          className="border-0 py-12"
        />
      </ChartCard>
    </>
  )
}
