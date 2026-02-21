export default function DashboardLoading() {
    return (
        <div className="space-y-6">
            {/* Welcome skeleton */}
            <div className="mb-6">
                <div className="h-8 w-64 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-4 w-96 bg-muted rounded animate-pulse"></div>
            </div>

            {/* Stats cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-lg border bg-card p-6 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                            <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                        </div>
                        <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
                        <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
                    </div>
                ))}
            </div>

            {/* Quick actions skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="rounded-lg border bg-card p-6 space-y-3">
                        <div className="h-5 w-32 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
