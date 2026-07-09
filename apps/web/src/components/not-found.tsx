import { Link } from '@tanstack/react-router'
import { Logo, buttonVariants, cn } from '@observo/ui'

export function NotFound() {
  return (
    <main className="bg-hero-depth flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Link to="/" aria-label="Observo home" className="mb-10 cursor-pointer">
        <Logo />
      </Link>
      <p className="label-mono text-error">404 · not found</p>
      <h1 className="mt-4 text-3xl font-medium tracking-tight text-ink-50 sm:text-4xl">
        This trace went cold.
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-ink-400">
        The page you're looking for doesn't exist or was moved. Check the URL,
        or head back to somewhere observable.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <Link to="/" className={cn(buttonVariants({ variant: 'secondary' }))}>
          Back to home
        </Link>
        <Link to="/dashboard" className={cn(buttonVariants())}>
          Open dashboard
        </Link>
      </div>
      <p className="mt-12 font-mono text-2xs text-ink-600">
        level=error message="route not matched" status=404
      </p>
    </main>
  )
}
