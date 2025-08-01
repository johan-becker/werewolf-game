export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 loading-pulse rounded" />
          <div className="h-4 w-32 loading-pulse rounded" />
        </div>
        <div className="h-10 w-32 loading-pulse rounded" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card-werewolf p-6">
            <div className="space-y-4">
              <div className="h-12 w-12 loading-pulse rounded-full mx-auto" />
              <div className="h-8 w-16 loading-pulse rounded mx-auto" />
              <div className="h-4 w-24 loading-pulse rounded mx-auto" />
            </div>
          </div>
        ))}
      </div>

      {/* Content area skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-werewolf p-6">
            <div className="space-y-4">
              <div className="h-6 w-32 loading-pulse rounded" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 loading-pulse rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="card-werewolf p-6">
            <div className="space-y-4">
              <div className="h-6 w-24 loading-pulse rounded" />
              <div className="h-32 loading-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}