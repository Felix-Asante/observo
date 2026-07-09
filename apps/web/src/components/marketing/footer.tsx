import { Container, Logo, StatusDot } from '@observo/ui'

const footerColumns = [
  {
    title: 'Product',
    links: [
      'Features',
      'Live tail',
      'Tracing',
      'Alerts',
      'Pricing',
      'Changelog',
    ],
  },
  {
    title: 'Developers',
    links: ['Documentation', 'API reference', 'SDKs', 'Status', 'Open source'],
  },
  {
    title: 'Company',
    links: ['About', 'Blog', 'Careers', 'Security', 'Contact'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'DPA', 'Subprocessors'],
  },
] as const

export function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <Container className="pt-16 pb-10 md:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] lg:gap-8">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
              Developer-first observability. Logs, traces, and metrics that keep
              up with how you ship.
            </p>
            <p className="mt-6 flex items-center gap-2 text-xs text-ink-400">
              <StatusDot tone="success" pulse />
              All systems operational
            </p>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="label-mono mb-4 text-ink-500">{column.title}</p>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="cursor-pointer text-sm text-ink-300 transition-colors duration-200 hover:text-ink-50"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-7 sm:flex-row">
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} Observo, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['GitHub', 'X', 'Discord'].map((social) => (
              <a
                key={social}
                href="#"
                className="cursor-pointer text-xs text-ink-500 transition-colors duration-200 hover:text-ink-200"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}
