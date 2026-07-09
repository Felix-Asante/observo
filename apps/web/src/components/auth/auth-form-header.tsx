export type AuthFormHeaderProps = {
  title: string
  subtitle: string
}

export function AuthFormHeader({ title, subtitle }: AuthFormHeaderProps) {
  return (
    <div className="mb-9">
      <h1 className="text-[1.625rem] font-medium tracking-heading text-ink-50 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2.5 text-sm leading-relaxed text-ink-400">{subtitle}</p>
    </div>
  )
}
