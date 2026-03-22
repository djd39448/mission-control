// Calendar tab page - placeholder for future calendar view
// TODO: Implement calendar events, time-blocks, and constraints
export default function Calendar() {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      <aside className="hidden w-64 flex-col border-r border-neutral-800 bg-black/80 px-4 py-6 sm:flex">
        {/* Sidebar navigation - reuse from main page */}
        <div className="mb-6 px-2">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            TrustCore
          </div>
          <div className="mt-1 text-lg font-semibold">Mission Control</div>
        </div>
      </aside>

      <main className="flex min-h-screen flex-1 flex-col bg-gradient-to-b from-neutral-950 to-neutral-950/95 px-4 py-4 sm:px-8 sm:py-6">
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-neutral-50 sm:text-xl">
            Calendar
          </h1>
          <p className="text-xs text-neutral-500 sm:text-sm">
            Coming soon: Events, time-blocks, and constraints.
          </p>
        </div>

        <div className="rounded-lg border border-dashed border-neutral-800 bg-black/40 p-8 text-center text-neutral-500">
          <p className="text-sm">Calendar view coming in a future checkpoint.</p>
        </div>
      </main>
    </div>
  );
}