import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { ButtonLink, Container, Logo, cn } from '@observo/ui'

import { navLinks } from '#/data/site'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300',
        scrolled ? 'surface-glass border-b' : 'border-b border-transparent',
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <a href="#" aria-label="Observo home" className="cursor-pointer">
          <Logo />
        </a>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="cursor-pointer rounded-md px-3 py-2 text-sm text-ink-300 transition-colors duration-200 hover:text-ink-50"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <ButtonLink href="#login" variant="ghost" size="sm">
            Sign in
          </ButtonLink>
          <ButtonLink href="#cta" size="sm">
            Start free
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="cursor-pointer rounded-md p-2 text-ink-300 transition-colors hover:bg-white/[0.05] hover:text-ink-50 md:hidden"
        >
          {open ? (
            <X className="size-5" aria-hidden />
          ) : (
            <Menu className="size-5" aria-hidden />
          )}
        </button>
      </Container>

      {open ? (
        <div className="surface-glass border-t md:hidden">
          <Container className="py-4">
            <nav className="flex flex-col" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="cursor-pointer rounded-md px-3 py-3 text-sm text-ink-200 transition-colors hover:bg-white/[0.04] hover:text-ink-50"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2 border-t border-border-subtle pt-4">
              <ButtonLink
                href="#login"
                variant="secondary"
                size="md"
                className="w-full"
              >
                Sign in
              </ButtonLink>
              <ButtonLink href="#cta" size="md" className="w-full">
                Start free
              </ButtonLink>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  )
}
