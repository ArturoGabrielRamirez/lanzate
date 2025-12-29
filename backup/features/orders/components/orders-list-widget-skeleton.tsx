function OrdersListWidgetSkeleton() {
    return (
        <div className="animate-pulse p-4 rounded-md border border-muted bg-muted/30 flex flex-col gap-3">
            <div className="h-6 w-1/3 bg-muted-foreground/20 rounded mb-2"></div>
            {[...Array(3)].map((_, idx) => (
                <div key={idx} className="h-10 w-full bg-muted-foreground/20 rounded mb-1"></div>
            ))}
        </div>
    )
}

export { OrdersListWidgetSkeleton }