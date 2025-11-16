const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>

        {/* Text */}
        <span className="text-gray-700 dark:text-gray-200 font-medium text-lg">
          Loading...
        </span>
      </div>
    </div>
  )
}

export default Loading;