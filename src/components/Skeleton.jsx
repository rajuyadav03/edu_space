/**
 * Skeleton loading components for better perceived performance
 */

export function ListingCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
      
      {/* Content skeleton */}
      <div className="p-5">
        {/* Title */}
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-3" />
        
        {/* Location */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mb-4" />
        
        {/* Metadata */}
        <div className="flex gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-16" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-20" />
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-lg w-24" />
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
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
