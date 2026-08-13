export function BudgetSidePanelSkeleton() {
  return (
    <aside className="grid gap-6 lg:grid-cols-2 xl:flex xl:flex-col" aria-label="Loading budget insights">
      <div className="rounded-lg border border-zinc-200/70 bg-white p-6 shadow-[0_18px_45px_-34px_rgba(24,24,27,0.35)]">
        <div className="h-4 w-24 rounded bg-zinc-200/80" />
        <div className="mt-5 grid gap-3">
          <div className="h-4 rounded bg-[#f1edec]" />
          <div className="h-4 rounded bg-[#f1edec]" />
          <div className="h-4 w-2/3 rounded bg-[#f1edec]" />
        </div>
      </div>
      <div className="rounded-lg border border-zinc-200/70 bg-white p-6 shadow-[0_18px_45px_-34px_rgba(24,24,27,0.35)]">
        <div className="h-7 w-44 rounded bg-zinc-200/80" />
        <div className="mt-6 grid gap-4">
          <div className="h-12 rounded bg-[#f1edec]" />
          <div className="h-12 rounded bg-[#f1edec]" />
          <div className="h-12 rounded bg-[#f1edec]" />
        </div>
      </div>
    </aside>
  )
}
