const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative">
        <div className="w-20 h-20 border-2 rounded-full border-emerald-200" />
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 rounded-full border-emerald-500 animate-spin" />
        <div className="sr-only">Loading</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
