export default function ScholarshipsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-lg w-56 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-[420px] max-w-full mb-8" />
      <div className="card p-4 mb-6 space-y-4">
        <div className="flex gap-3 flex-wrap">
          <div className="h-10 bg-gray-200 rounded-xl flex-1 min-w-[200px]" />
          <div className="h-10 bg-gray-200 rounded-xl w-36" />
          <div className="h-10 bg-gray-200 rounded-xl w-32" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-7 w-24 bg-gray-200 rounded-full" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-5 space-y-3">
            <div className="flex gap-2">
              <div className="h-5 w-20 bg-gray-200 rounded-full" />
              <div className="h-5 w-12 bg-gray-200 rounded-full" />
              <div className="h-5 w-20 bg-gray-200 rounded-full" />
            </div>
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-16 bg-gray-100 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
