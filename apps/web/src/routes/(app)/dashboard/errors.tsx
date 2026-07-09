import { createFileRoute } from '@tanstack/react-router'
import { Card, TBody, THead, Table, Td, Th, Tr, cn } from '@observo/ui'

import { Sparkline } from '#/components/dashboard/charts/sparkline'
import { ImportanceBadge } from '#/components/dashboard/shared/level-badge'
import { PageHeader } from '#/components/dashboard/shared/page-header'
import { errorIssues } from '#/data/dashboard/errors'

export const Route = createFileRoute('/(app)/dashboard/errors')({
  head: () => ({ meta: [{ title: 'Errors · Observo' }] }),
  component: ErrorsPage,
})

const summary: Array<{ label: string; value: string; className?: string }> = [
  { label: 'Open issues', value: '6' },
  { label: 'Critical', value: '1', className: 'text-error' },
  { label: 'Events (24h)', value: '260' },
  { label: 'Resolved this week', value: '14', className: 'text-success' },
]

function ErrorsPage() {
  return (
    <>
      <PageHeader
        title="Errors"
        description="Error-level events grouped into issues, ranked by volume and severity."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summary.map((stat) => (
          <Card key={stat.label} className="px-5 py-4">
            <p className="text-2xs font-medium tracking-wide text-ink-500 uppercase">
              {stat.label}
            </p>
            <p
              className={cn(
                'mt-1.5 font-mono text-xl font-semibold text-ink-50',
                stat.className,
              )}
            >
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="surface-card overflow-hidden rounded-xl">
        <Table>
          <THead>
            <tr>
              <Th>Issue</Th>
              <Th className="w-24">Severity</Th>
              <Th className="hidden w-24 lg:table-cell">App</Th>
              <Th className="w-20 text-right">24h</Th>
              <Th className="hidden w-28 xl:table-cell">Trend</Th>
              <Th className="hidden w-24 sm:table-cell">Last seen</Th>
            </tr>
          </THead>
          <TBody>
            {errorIssues.map((issue) => (
              <Tr key={issue.id} interactive>
                <Td className="max-w-0">
                  <p className="truncate font-mono text-xs text-ink-100">
                    {issue.message}
                  </p>
                  <p className="mt-0.5 font-mono text-2xs text-ink-600">
                    first seen {issue.firstSeen} · {issue.environment}
                  </p>
                </Td>
                <Td>
                  <ImportanceBadge importance={issue.importance} />
                </Td>
                <Td className="hidden font-mono text-xs text-ink-400 lg:table-cell">
                  {issue.appName}
                </Td>
                <Td className="text-right font-mono text-xs text-ink-100">
                  {issue.count24h}
                </Td>
                <Td className="hidden xl:table-cell">
                  <Sparkline
                    data={issue.trend}
                    className="h-6 w-24"
                    strokeClass="text-error/70"
                  />
                </Td>
                <Td className="hidden font-mono text-xs whitespace-nowrap text-ink-500 sm:table-cell">
                  {issue.lastSeen}
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>
    </>
  )
}
