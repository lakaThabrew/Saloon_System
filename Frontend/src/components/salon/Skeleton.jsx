/**
 * Skeleton loading placeholders.
 * Each uses the `.skeleton` class from styles.css which provides the shimmer.
 */

export function ServiceCardSkeleton() {
  return (
    <div className="flex gap-3 rounded-xl border border-border p-3">
      <div className="skeleton h-16 w-16 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1 space-y-2 py-1">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    </div>
  );
}

export function ServiceCardLargeSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[1.25rem] border border-border bg-card">
      <div className="skeleton aspect-[1.15] w-full" />
      <div className="flex flex-1 flex-col p-6 space-y-3">
        <div className="flex gap-2">
          <div className="skeleton h-6 w-14 rounded-full" />
          <div className="skeleton h-6 w-12 rounded-full" />
        </div>
        <div className="skeleton h-6 w-40 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
          <div className="skeleton h-4 w-16 rounded" />
          <div className="skeleton h-8 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function StaffCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 text-center">
      <div className="skeleton h-12 w-12 rounded-full" />
      <div className="skeleton h-4 w-24 rounded" />
      <div className="skeleton h-3 w-20 rounded" />
      <div className="skeleton h-3 w-12 rounded" />
    </div>
  );
}

export function StaffHomeSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="skeleton h-16 w-16 rounded-full" />
      <div className="mt-5 skeleton h-6 w-32 rounded" />
      <div className="mt-2 skeleton h-4 w-24 rounded" />
      <div className="mt-3 skeleton h-3 w-16 rounded" />
    </div>
  );
}

export function SlotSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="skeleton h-10 rounded-md" />
      ))}
    </>
  );
}

export function FeaturedServiceSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[1.25rem] border border-border bg-card">
      <div className="skeleton aspect-[0.9]" />
    </div>
  );
}
