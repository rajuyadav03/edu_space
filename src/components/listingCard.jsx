import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { favoritesAPI } from "../services/api";
import { cn } from "../lib/utils";

function ListingCard({ item, onHover, isFavorited = false, onFavoriteToggle }) {
  const { isAuthenticated } = useAuth();
  const { isBlock } = useTheme();
  const [fav, setFav] = useState(isFavorited);
  const [toggling, setToggling] = useState(false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    if (toggling) return;

    try {
      setToggling(true);
      const listingId = item._id || item.id;
      if (fav) {
        await favoritesAPI.remove(listingId);
        setFav(false);
      } else {
        await favoritesAPI.add(listingId);
        setFav(true);
      }
      onFavoriteToggle?.(listingId, !fav);
    } catch (err) {
      console.error("Favorite toggle failed:", err);
    } finally {
      setToggling(false);
    }
  };

  return (
    <Link
      to={`/listing/${item._id || item.id}`}
      onMouseEnter={() => onHover?.(item)}
      onMouseLeave={() => onHover?.(null)}
      className={cn(
        "group block transition-all h-full flex flex-col",
        isBlock
          ? "bg-white dark:bg-neutral-900 rounded-2xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] relative z-10"
          : "card-premium bg-white dark:bg-neutral-900"
      )}
    >
      {/* Image Container */}
      <div className={cn(
        "relative overflow-hidden aspect-[4/3] shrink-0",
        isBlock ? "rounded-t-xl border-b-4 border-slate-900" : ""
      )}>
        <img
          src={item.image || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"}
          alt={item.name || "Space"}
          className="w-full h-full object-cover image-zoom"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"; }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Favorite Button */}
        <button
          type="button"
          aria-label={fav ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
          onClick={handleFavorite}
          className={cn(
            "absolute top-4 right-4 w-11 h-11 flex items-center justify-center transition-all focus:outline-none z-20",
            isBlock
              ? "bg-white border-2 border-slate-900 rounded-full shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]"
              : "heart-btn glass rounded-full shadow-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
            toggling ? "scale-90 opacity-60" : ""
          )}
        >
          <svg
            className={`w-5 h-5 transition-colors ${fav ? 'text-pink-500 fill-pink-500' : 'text-gray-700 dark:text-gray-300 group-hover:text-pink-500 dark:group-hover:text-pink-400'}`}
            fill={fav ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Space Type Badge */}
        <div className={cn(
          "absolute top-4 left-4 px-4 py-1.5 font-bold shadow-sm z-20",
          isBlock
            ? "bg-amber-300 text-slate-900 border-2 border-slate-900 rounded-full shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] text-xs uppercase tracking-wide"
            : "bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-full text-xs text-blue-700 dark:text-blue-400 border border-white/20"
        )}>
          {item.spaceType}
        </div>
      </div>

      {/* Content */}
      <div className={cn("p-6 flex flex-col flex-1", isBlock ? "bg-white dark:bg-neutral-900 rounded-b-xl" : "")}>
        <h3 className={cn(
          "text-xl mb-2 line-clamp-1",
          isBlock ? "font-black text-slate-900 dark:text-white uppercase tracking-tight" : "font-bold text-slate-900 dark:text-white text-hover-slide tracking-tight"
        )}>
          {item.name}
        </h3>
        <p className="text-sm text-slate-500 dark:text-gray-400 mb-4 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{item.location}</span>
        </p>

        <div className="flex items-center gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-neutral-800/50 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {item.capacity}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100 dark:border-neutral-800/50">
          <div>
            <span className={cn(
              "text-2xl",
              isBlock ? "font-black text-slate-900 dark:text-white" : "font-black text-blue-700 dark:text-blue-400"
            )}>₹{item.price}</span>
            <span className={cn("text-sm ml-1", isBlock ? "font-bold text-slate-500" : "font-medium text-slate-500 dark:text-gray-400")}>/day</span>
          </div>
          <div className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300",
            isBlock
              ? "bg-blue-600 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] group-hover:translate-y-[2px] group-hover:shadow-none"
              : "btn-premium-arrow bg-slate-100 dark:bg-neutral-800 group-hover:bg-amber-500 dark:group-hover:bg-amber-500"
          )}>
            <svg className={cn("w-5 h-5", isBlock ? "text-white" : "text-slate-600 dark:text-slate-300 group-hover:text-white")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default memo(ListingCard);
