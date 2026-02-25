import { memo } from "react";

/**
 * EduSpace Premium Loader
 * Animated building blocks that form a structure — representing educational spaces.
 * Works in both light and dark modes.
 */
function EduSpaceLoader({ message = "Loading..." }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 transition-colors">
            <div className="flex flex-col items-center gap-8">
                {/* Animated Building Blocks */}
                <div className="eduspace-loader" aria-hidden="true">
                    <div className="loader-building">
                        {/* Roof */}
                        <div className="loader-roof" />
                        {/* Building blocks */}
                        <div className="loader-blocks">
                            <div className="loader-block block-1" />
                            <div className="loader-block block-2" />
                            <div className="loader-block block-3" />
                            <div className="loader-block block-4" />
                            <div className="loader-block block-5" />
                            <div className="loader-block block-6" />
                        </div>
                        {/* Door */}
                        <div className="loader-door" />
                    </div>
                    {/* Floating particles */}
                    <div className="loader-particle p-1" />
                    <div className="loader-particle p-2" />
                    <div className="loader-particle p-3" />
                    {/* Ground line */}
                    <div className="loader-ground" />
                </div>

                {/* Brand text */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight loader-text-fade">
                        Edu<span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Space</span>
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 loader-dots">
                        {message}
                    </p>
                </div>

                {/* Progress bar */}
                <div className="w-48 h-1 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="loader-progress h-full rounded-full" />
                </div>
            </div>
        </div>
    );
}

export default memo(EduSpaceLoader);
