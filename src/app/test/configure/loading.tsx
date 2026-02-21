export default function ConfigureLoading() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="h-8 w-56 bg-muted rounded animate-pulse mb-4"></div>
            <div className="rounded-lg border bg-card p-6 space-y-6">
                <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
                </div>
                <div className="h-12 w-full bg-muted rounded animate-pulse mt-4"></div>
            </div>
        </div>
    );
}
