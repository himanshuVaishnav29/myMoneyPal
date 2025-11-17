const ComponentLoader = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center space-y-3">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 border-2 border-gray-600 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-400 text-xs">Loading...</p>
      </div>
    </div>
  );
};

export default ComponentLoader;