function SkeletonBlock({
  className,
}: {
  className?: string;
}) {
  return <div className={`skeleton-shimmer ${className || ""}`} />;
}

function HeroMetaCard() {
  return (
    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center gap-1 rounded-[12px] bg-[#d9dce1] px-1 py-2">
      <SkeletonBlock className="h-4 w-4 rounded-full" />
      <SkeletonBlock className="h-3 w-8 rounded-full" />
    </div>
  );
}

function ReviewItemSkeleton() {
  return (
    <article className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <SkeletonBlock className="h-8 w-8 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <SkeletonBlock className="h-4 w-16 rounded-full" />
          <SkeletonBlock className="h-6 w-14 rounded-full" />
        </div>
        <SkeletonBlock className="h-5 w-5 rounded-full" />
      </div>

      <div className="flex items-center gap-2">
        <SkeletonBlock className="h-4 w-20 rounded-full" />
        <SkeletonBlock className="h-4 w-16 rounded-full" />
      </div>

      <div className="space-y-2 pt-1">
        <SkeletonBlock className="h-4 w-full rounded-full" />
        <SkeletonBlock className="h-4 w-[92%] rounded-full" />
      </div>
    </article>
  );
}

export default function PlayroomGameDetailLoading() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbfbfb_0%,#ffffff_26%,#f3f4f6_100%)] pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-[calc(env(safe-area-inset-bottom)+112px)]">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
        <section className="overflow-hidden rounded-[30px] bg-[#f8f8f8] shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
          <div className="bg-[linear-gradient(180deg,rgba(236,239,243,0.96),rgba(246,247,249,0.98))] p-5">
            <div className="mb-4 flex items-center justify-between">
              <SkeletonBlock className="h-6 w-6 rounded-full" />
              <SkeletonBlock className="h-6 w-6 rounded-full" />
            </div>

            <div className="grid grid-cols-[123px_minmax(0,1fr)] gap-6 px-3">
              <SkeletonBlock className="h-[173px] w-[123px] rounded-[12px]" />

              <div className="flex min-h-[173px] flex-col">
                <div className="flex flex-1 flex-col gap-[10px] py-3">
                  <SkeletonBlock className="h-9 w-[68%] rounded-[12px]" />
                  <SkeletonBlock className="h-6 w-24 rounded-full" />
                </div>

                <div className="mt-auto flex items-center gap-3">
                  <HeroMetaCard />
                  <HeroMetaCard />
                  <HeroMetaCard />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f8f8f8]">
            <div className="flex flex-col gap-2">
              <section className="bg-white p-5">
                <SkeletonBlock className="mb-3 h-4 w-28 rounded-full" />
                <div className="grid grid-cols-[minmax(0,1fr)_142px] gap-[10px]">
                  <div className="flex min-w-0 flex-col justify-center gap-2">
                    <SkeletonBlock className="h-6 w-[86%] rounded-full" />
                    <SkeletonBlock className="h-6 w-[72%] rounded-full" />
                    <SkeletonBlock className="h-4 w-[78%] rounded-full" />
                    <SkeletonBlock className="h-4 w-[70%] rounded-full" />
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="flex h-[130px] w-[142px] items-center justify-center">
                      <div className="relative h-[92px] w-[92px] rounded-[4px] bg-[#f2f3f5]">
                        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#d7d7d7]" />
                        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#d7d7d7]" />
                        <SkeletonBlock className="absolute left-[58%] top-[24%] h-3 w-3 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white p-5">
                <div className="space-y-3">
                  <SkeletonBlock className="h-5 w-24 rounded-full" />
                  <SkeletonBlock className="h-4 w-full rounded-full" />
                  <SkeletonBlock className="h-4 w-[96%] rounded-full" />
                  <SkeletonBlock className="h-4 w-[92%] rounded-full" />
                  <SkeletonBlock className="h-4 w-[84%] rounded-full" />
                  <SkeletonBlock className="h-4 w-[88%] rounded-full" />
                  <SkeletonBlock className="h-4 w-[80%] rounded-full" />
                </div>
              </section>

              <section className="bg-white p-5">
                <div className="flex flex-col gap-8">
                  <div className="flex items-center justify-center gap-3 py-3">
                    <SkeletonBlock className="h-10 w-28 rounded-full" />
                    <div className="flex min-w-0 flex-1 flex-col items-start gap-[10px]">
                      <div className="flex w-full items-center gap-[10px]">
                        <SkeletonBlock className="h-5 w-5 rounded-full" />
                        <SkeletonBlock className="h-[6px] flex-1 rounded-full" />
                      </div>
                      <div className="flex w-full items-center gap-[10px]">
                        <SkeletonBlock className="h-5 w-5 rounded-full" />
                        <SkeletonBlock className="h-[6px] flex-1 rounded-full" />
                      </div>
                      <div className="flex w-full items-center gap-[10px]">
                        <SkeletonBlock className="h-5 w-5 rounded-full" />
                        <SkeletonBlock className="h-[6px] flex-1 rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8 px-1">
                    <ReviewItemSkeleton />
                    <ReviewItemSkeleton />
                    <ReviewItemSkeleton />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4">
        <div className="mx-auto w-full max-w-[720px] md:max-w-[600px]">
          <SkeletonBlock className="h-[56px] w-full rounded-[100px]" />
        </div>
      </div>
    </main>
  );
}
