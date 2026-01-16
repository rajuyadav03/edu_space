import { memo } from "react";
import { Link } from "react-router-dom";

function ListingCard({ item, onHover }) {
  return (
    <Link
      to={`/listing/${item._id || item.id}`}
      onMouseEnter={() => onHover?.(item)}
      onMouseLeave={() => onHover?.(null)}
      className="group block card-premium"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={item.image || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"}
          alt={item.name || "Space"}
          className="w-full h-full object-cover image-zoom"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"; }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Favorite Button - Glassmorphism */}
        <button
          type="button"
          aria-label={`Add ${item.name} to favorites`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // TODO: Add to favorites functionality
          }}
          className="heart-btn absolute top-4 right-4 w-11 h-11 glass rounded-full flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Space Type Badge */}
        <div className="absolute bottom-4 left-4 px-3 py-1.5 glass rounded-full text-xs font-semibold text-gray-800 dark:text-gray-200">
          {item.spaceType}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 text-hover-slide tracking-tight line-clamp-1">
          {item.name}
        </h3>

        {/* Location */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{item.location}</span>
        </p>

        {/* Capacity Tag */}
        <div className="flex items-center gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {item.capacity}
          </span>
        </div>

        {/* Price Row */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{item.price}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/day</span>
          </div>

          {/* Animated Arrow Button */}
          <div className="btn-premium-arrow w-11 h-11 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 transition-colors duration-300">
            <svg className="w-5 h-5 text-white dark:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default memo(ListingCard);
