// Modern Loading Spinner Component with High Contrast
export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
      <div className="relative">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-300 dark:border-gray-700"></div>
        
        {/* Spinning gradient ring */}
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-indigo-600 border-r-purple-600"></div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <p className="ml-4 text-black dark:text-white font-bold text-lg animate-pulse">
        Loading...
      </p>
    </div>
  );
}
