export default function AnalyticsLoading() {
    return (
        <div className="space-y-6">
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
                        <div className="h-5 w-36 bg-muted rounded animate-pulse"></div>
                        <div className="h-48 w-full bg-muted rounded animate-pulse"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
