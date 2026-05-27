function SkeletonBlock({
  className,
}: {
  className: string;
}) {
  return <div className={`skeleton-shimmer rounded-2xl ${className}`} />;
}

function NotebookRing() {
  return (
    <div className="h-7 w-4 rounded-r-full border-[3px] border-l-0 border-black/30 bg-white/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)] md:h-9 md:w-5" />
  );
}

function DecorativeStar({ className }: { className: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`}>
      <div className="relative h-7 w-7 opacity-50">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-black/35" />
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-black/35" />
        <div className="absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black/25" />
        <div className="absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-black/25" />
      </div>
    </div>
  );
}

function GridPaper({ className }: { className: string }) {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(17,24,39,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(17,24,39,0.14) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
      }}
    />
  );
}

export default function PlayroomGameDetailLoading() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#faf7ee_0%,#fffdfa_26%,#f8fafc_100%)]">
      <GridPaper className="inset-0 opacity-90" />
      <GridPaper className="right-0 top-0 h-40 w-44 rounded-bl-[36px] bg-black/6 opacity-70 md:h-52 md:w-72" />
      <GridPaper className="bottom-0 left-0 h-24 w-36 rounded-tr-[28px] bg-black/6 opacity-70 md:h-32 md:w-52" />

      <div className="pointer-events-none absolute left-6 top-8 hidden flex-col gap-4 md:flex">
        {Array.from({ length: 7 }).map((_, index) => (
          <NotebookRing key={`ring-${index}`} />
        ))}
      </div>

      <DecorativeStar className="left-[32%] top-24 hidden md:block" />
      <DecorativeStar className="right-[16%] top-40 hidden md:block" />

      <div className="relative mx-auto flex w-full max-w-[1020px] flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
        <div className="flex items-center gap-3">
          <SkeletonBlock className="h-10 w-36 rounded-full border border-white/80" />
          <div className="h-4 w-4 rounded-full bg-[#f4d43d]/70 shadow-[0_0_0_6px_rgba(244,212,61,0.18)]" />
        </div>

        <section className="relative overflow-hidden rounded-[32px] border border-black/8 bg-[rgba(255,253,247,0.92)] shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
          <div className="absolute left-1/2 top-5 h-5 w-20 -translate-x-1/2 rotate-[-7deg] rounded-sm bg-[#f1dfbb]/80 shadow-sm md:w-24" />
          <div className="absolute left-[18%] top-[46%] h-4 w-14 rotate-[16deg] rounded-sm bg-[#efe4a8]/80 shadow-sm" />
          <div className="absolute right-[14%] top-[18%] h-10 w-10 rounded-full border border-[#8ecf49]/55 bg-[#a6db63]/35" />

          <div className="relative flex flex-col gap-7 p-5 md:flex-row md:items-start md:gap-8 md:p-8">
            <div className="mx-auto w-full max-w-[270px] md:mx-0 md:w-[240px]">
              <div className="relative rotate-[-3deg] rounded-[28px] bg-white p-3 shadow-[0_20px_40px_rgba(15,23,42,0.10)]">
                <div className="absolute left-7 top-[-10px] h-5 w-16 rotate-[-8deg] rounded-sm bg-[#efe4c4]/85 shadow-sm" />
                <div className="absolute right-7 top-[-8px] h-5 w-14 rotate-[9deg] rounded-sm bg-[#efe4c4]/75 shadow-sm" />
                <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-slate-100">
                  <div className="skeleton-shimmer h-full w-full" />
                </div>
                <div className="mt-4 space-y-3 px-1 pb-1">
                  <SkeletonBlock className="h-4 w-24 rounded-full" />
                  <SkeletonBlock className="h-8 w-40" />
                </div>
              </div>
            </div>

            <div className="flex-1 pt-1">
              <div className="mb-4 flex flex-wrap gap-2">
                <SkeletonBlock className="h-8 w-28 rounded-full" />
                <SkeletonBlock className="h-8 w-24 rounded-full" />
              </div>

              <div className="space-y-3">
                <SkeletonBlock className="h-6 w-28 rounded-full" />
                <SkeletonBlock className="h-14 w-[78%] max-w-[500px] rounded-[28px]" />
                <SkeletonBlock className="h-6 w-full max-w-[600px]" />
                <SkeletonBlock className="h-6 w-[92%] max-w-[560px]" />
                <SkeletonBlock className="h-6 w-[72%] max-w-[430px]" />
              </div>

              <div className="mt-7 flex items-center gap-4">
                <SkeletonBlock className="h-12 w-40 rounded-full" />
                <div className="h-12 w-12 rounded-full border border-pink-300/50 bg-pink-200/20" />
              </div>
            </div>
          </div>

          <div className="border-t border-black/8 bg-white/45 p-5 md:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full border border-black/10 bg-[#f5ca4d]/30" />
              <SkeletonBlock className="h-6 w-44 rounded-full" />
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[26px] bg-white/75 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <div className="space-y-3">
                  <SkeletonBlock className="h-5 w-full" />
                  <SkeletonBlock className="h-5 w-[96%]" />
                  <SkeletonBlock className="h-5 w-[92%]" />
                  <SkeletonBlock className="h-5 w-[78%]" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rotate-[-2deg] rounded-[24px] bg-white/80 p-3 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-slate-100">
                    <div className="skeleton-shimmer h-full w-full" />
                  </div>
                </div>
                <div className="rotate-[1.5deg] rounded-[24px] bg-white/80 p-3 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-slate-100">
                    <div className="skeleton-shimmer h-full w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
