import { createFileRoute } from '@tanstack/react-router'
import { Badge, Card, TBody, THead, Table, Td, Th, Tr, cn } from '@observo/ui'

import { TraceWaterfall } from '#/components/dashboard/tracing/trace-waterfall'
import { PageHeader } from '#/components/dashboard/shared/page-header'
import { recentTraces, sampleTrace } from '#/data/dashboard/tracing'

export const Route = createFileRoute('/(app)/dashboard/tracing')({
  head: () => ({ meta: [{ title: 'Tracing · Observo' }] }),
  component: TracingPage,
})

const statusVariant = {
  ok: 'success',
  error: 'error',
  timeout: 'warning',
} as const

function TracingPage() {
  return (
    <>
      <PageHeader
        title="Distributed tracing"
        description="Follow requests across services with waterfall views connected to logs and errors by trace ID."
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="border-b border-border-subtle px-5 py-3.5">
            <h2 className="text-sm font-medium text-ink-50">Recent traces</h2>
            <p className="mt-0.5 text-xs text-ink-500">
              last hour · production
            </p>
          </div>
          <Table>
            <THead>
              <tr>
                <Th>Trace</Th>
                <Th className="hidden sm:table-cell">Operation</Th>
                <Th className="w-20 text-right">Duration</Th>
                <Th className="w-20">Status</Th>
              </tr>
            </THead>
            <TBody>
              {recentTraces.map((trace) => (
                <Tr key={trace.id} interactive>
                  <Td>
                    <p className="font-mono text-xs text-iris-300">
                      {trace.id}
                    </p>
                    <p className="mt-0.5 font-mono text-2xs text-ink-600">
                      {trace.time}
                    </p>
                  </Td>
                  <Td className="hidden max-w-0 truncate font-mono text-xs text-ink-200 sm:table-cell">
                    {trace.operation}
                  </Td>
                  <Td
                    className={cn(
                      'text-right font-mono text-xs',
                      trace.durationMs > 1000 ? 'text-error' : 'text-ink-100',
                    )}
                  >
                    {trace.durationMs}ms
                  </Td>
                  <Td>
                    <Badge variant={statusVariant[trace.status]} size="sm">
                      {trace.status}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </Card>

        <Card className="p-5">
          <div className="mb-5">
            <h2 className="text-sm font-medium text-ink-50">Trace 4fa2c81b</h2>
            <p className="mt-0.5 font-mono text-xs text-ink-500">
              POST /v1/checkout · 284ms · 12 spans · 1 error
            </p>
          </div>
          <TraceWaterfall trace={sampleTrace} totalMs={284} />
        </Card>
      </div>
    </>
  )
}
