export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
                </div>
                <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
}
