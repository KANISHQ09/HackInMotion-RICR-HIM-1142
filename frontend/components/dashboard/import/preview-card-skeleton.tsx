export function PreviewCardSkeleton() {
  return (
    <section
      className="overflow-hidden rounded-lg border border-zinc-200/80 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
      aria-label="Loading transaction format preview"
    >
      <div className="flex flex-col gap-4 border-b border-zinc-200/70 bg-[#f7f3f2]/60 p-4 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <div className="h-8 w-64 max-w-full rounded bg-zinc-200/80" />
        <div className="h-8 w-36 rounded-full bg-zinc-200/80" />
      </div>
      <div className="grid gap-3 p-6">
        <div className="h-4 w-full rounded bg-zinc-100" />
        <div className="h-4 w-11/12 rounded bg-zinc-100" />
        <div className="h-4 w-10/12 rounded bg-zinc-100" />
      </div>
    </section>
  )
}
