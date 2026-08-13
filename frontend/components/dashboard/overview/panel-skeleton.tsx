export function PanelSkeleton({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <section
      className="rounded-lg border border-zinc-200/80 bg-white p-6 shadow-[0_18px_45px_-32px_rgba(24,24,27,0.35)]"
      aria-label={label}
    >
      <div className="h-6 w-44 rounded bg-zinc-200/80" />
      <div className={compact ? "mt-6 grid gap-3" : "mt-8 grid gap-4 sm:grid-cols-2"}>
        <div className="h-36 rounded-lg bg-[#f1edec]" />
        <div className="h-36 rounded-lg bg-[#f7f3f2]" />
      </div>
    </section>
  )
}
