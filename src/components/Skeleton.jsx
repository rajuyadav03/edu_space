/**
 * Skeleton loading components for better perceived performance
 */
import { useTheme } from "../context/ThemeContext";
import { cn } from "../lib/utils";

export function ListingCardSkeleton() {
  const { isBlock } = useTheme();

  return (
    <div className={cn(
      "overflow-hidden animate-pulse h-full",
      isBlock
        ? "bg-white dark:bg-neutral-900 rounded-2xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]"
        : "bg-white dark:bg-neutral-900 rounded-[2rem] border border-slate-100 dark:border-neutral-800 shadow-sm"
    )}>
      {/* Image skeleton */}
      <div className={cn(
        "aspect-[4/3] bg-slate-100 dark:bg-neutral-800",
        isBlock ? "border-b-4 border-slate-900" : ""
      )} />

      {/* Content skeleton */}
      <div className="p-6">
        {/* Title */}
        <div className={cn("h-6 mb-4", isBlock ? "bg-amber-300 dark:bg-amber-900/50 rounded-md w-3/4 border-2 border-slate-900/10" : "bg-slate-200 dark:bg-neutral-700 rounded-full w-3/4")} />

        {/* Location */}
        <div className={cn("h-4 mb-5", isBlock ? "bg-slate-200 dark:bg-neutral-800 rounded-sm w-1/2" : "bg-slate-200 dark:bg-neutral-700 rounded-full w-1/2")} />

        {/* Metadata */}
        <div className="flex gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-neutral-800">
          <div className={cn("h-6 w-20", isBlock ? "bg-cyan-200 dark:bg-cyan-900/50 rounded-sm" : "bg-slate-200 dark:bg-neutral-700 rounded-full")} />
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className={cn("h-7 w-24", isBlock ? "bg-slate-300 dark:bg-neutral-700 rounded-sm" : "bg-gray-200 dark:bg-gray-700 rounded-lg")} />
          <div className={cn("w-10 h-10", isBlock ? "bg-slate-200 dark:bg-neutral-800 rounded-full border-2 border-slate-900/20" : "bg-gray-200 dark:bg-gray-700 rounded-full")} />
        </div>
      </div>
    </div>
  );
}

export function ListingGridSkeleton({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ListingCardSkeleton key={index} />
      ))}
    </>
  );
}

export function MapSkeleton() {
  return (
    <div className="h-full w-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
      <div className="text-center">
        <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <span className="text-sm text-gray-400 dark:text-gray-500">Loading map...</span>
      </div>
    </div>
  );
}

export default { ListingCardSkeleton, ListingGridSkeleton, MapSkeleton };
