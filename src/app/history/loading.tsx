export default function HistoryLoading() {
    return (
        <div className="space-y-6">
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-4"></div>
            {[...Array(5)].map((_, i) => (
                <div key={i} className="rounded-lg border bg-card p-4 flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="h-5 w-40 bg-muted rounded animate-pulse"></div>
                        <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                    </div>
                    <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
                </div>
            ))}
        </div>
    );
}
