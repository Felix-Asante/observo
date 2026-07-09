import { ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Logo } from '@observo/ui'

import { Reveal } from '#/components/animations/reveal'
import { site } from '#/data/site'
import { AuthHeroPanel } from './hero-panel'
import type { ReactNode } from 'react'

/**
 * Split-screen auth shell: product story on the left,
 * form on the right. The hero collapses on small screens.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-1/2 lg:block xl:w-[54%]">
        <AuthHeroPanel />
      </aside>

      <main className="flex min-h-screen flex-1 flex-col px-6 sm:px-10">
        <header className="flex h-20 items-center justify-between">
          <Link
            to="/"
            aria-label="Back to Observo home"
            className="cursor-pointer lg:hidden"
          >
            <Logo />
          </Link>
          <Link
            to="/"
            className="group ml-auto flex cursor-pointer items-center gap-1.5 text-sm text-ink-400 transition-colors duration-200 hover:text-ink-100"
          >
            <ArrowLeft
              className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden
            />
            Back to landing
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center py-12">
          <Reveal y={14} className="w-full max-w-[400px]">
            {children}
          </Reveal>
        </div>

        <footer className="flex h-20 flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-ink-600">
            © {new Date().getFullYear()} Observo, Inc.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="#"
              className="cursor-pointer text-xs text-ink-500 transition-colors duration-200 hover:text-ink-200"
            >
              Terms
            </a>
            <a
              href="#"
              className="cursor-pointer text-xs text-ink-500 transition-colors duration-200 hover:text-ink-200"
            >
              Privacy
            </a>
            <span className="font-mono text-2xs text-ink-600">
              {site.version}
            </span>
          </div>
        </footer>
      </main>
    </div>
  )
}
