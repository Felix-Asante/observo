import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { CodeWindow, Section, SectionHeading, cn } from '@observo/ui'

import { Reveal } from '#/components/animations/reveal'
import { codeSamples } from '#/data/code-samples'
import type { CodeLine } from '#/data/code-samples'

function TokenLine({ line }: { line: CodeLine }) {
  if (line.length === 0) return <span>{'\n'}</span>
  return (
    <span>
      {line.map((token, i) => (
        <span
          key={i}
          className={token.tok ? `tok-${token.tok}` : 'text-ink-100'}
        >
          {token.text}
        </span>
      ))}
      {'\n'}
    </span>
  )
}

export function DeveloperExperience() {
  const [activeId, setActiveId] = useState(codeSamples[0].id)
  const [copied, setCopied] = useState(false)
  const active =
    codeSamples.find((sample) => sample.id === activeId) ?? codeSamples[0]

  const copyInstall = async () => {
    await navigator.clipboard.writeText(active.install)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Section id="developer-experience">
      <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Get started in minutes"
            title="Five lines of code. That's it."
            description="No complex setup, no performance hits, no waiting around. Drop in the SDK, deploy, and watch logs appear — no config, no servers, no YAML."
            className="mb-8 md:mb-10"
          />

          <ul className="space-y-4">
            {[
              'Typed SDKs for Node.js, Next.js, Python, and Go',
              'Automatic batching, retries, and backpressure handling',
              'Scoped API keys per project and environment',
              'Local dev mode that pretty-prints to your terminal',
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-ink-200"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-iris-400"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Reveal y={24}>
          <CodeWindow
            title={active.install}
            actions={
              <button
                type="button"
                onClick={copyInstall}
                aria-label="Copy install command"
                className="cursor-pointer rounded-md p-1.5 text-ink-400 transition-colors duration-200 hover:bg-white/[0.06] hover:text-ink-100"
              >
                {copied ? (
                  <Check className="size-3.5 text-success" aria-hidden />
                ) : (
                  <Copy className="size-3.5" aria-hidden />
                )}
              </button>
            }
          >
            <div
              className="flex items-center gap-1 border-b border-border-subtle px-3 py-2"
              role="tablist"
              aria-label="SDK language"
            >
              {codeSamples.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  role="tab"
                  aria-selected={sample.id === activeId}
                  onClick={() => setActiveId(sample.id)}
                  className={cn(
                    'cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200',
                    sample.id === activeId
                      ? 'bg-white/[0.06] text-ink-50'
                      : 'text-ink-400 hover:text-ink-200',
                  )}
                >
                  {sample.label}
                </button>
              ))}
            </div>
            <pre className="min-h-[248px] overflow-x-auto p-5 font-mono text-[0.8125rem] leading-7">
              <code>
                {active.lines.map((line, i) => (
                  <TokenLine key={`${active.id}-${i}`} line={line} />
                ))}
              </code>
            </pre>
          </CodeWindow>
        </Reveal>
      </div>
    </Section>
  )
}
