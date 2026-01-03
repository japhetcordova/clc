import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLoading() {
    return (
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto min-h-screen bg-background">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-48 sm:w-64 rounded-xl" />
                    <Skeleton className="h-4 w-64 sm:w-80 rounded-lg" />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Skeleton className="h-10 w-32 rounded-2xl" />
                    <Skeleton className="h-10 w-24 rounded-2xl" />
                </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="shadow-lg border-border bg-card rounded-3xl overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6">
                                <Skeleton className="h-4 w-20 rounded-lg" />
                                <Skeleton className="h-5 w-5 rounded-full" />
                            </CardHeader>
                            <CardContent className="p-3 sm:p-6 pt-0">
                                <Skeleton className="h-8 w-16 mb-2 rounded-lg" />
                                <Skeleton className="h-3 w-24 rounded-lg" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pb-10 items-start">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Main Content Skeleton */}
                        <Card className="shadow-2xl border-border bg-card/50 rounded-[2rem] overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 py-4 sm:py-6 px-4 sm:px-8">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-xl" />
                                    <Skeleton className="h-6 w-40 rounded-lg" />
                                </div>
                                <Skeleton className="h-5 w-5 rounded-md" />
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="px-4 sm:px-8 pt-6 space-y-4">
                                    {/* Filters Skeleton */}
                                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="space-y-2">
                                                <Skeleton className="h-3 w-16 rounded-md" />
                                                <Skeleton className="h-11 w-full rounded-xl" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <Skeleton className="h-11 w-32 rounded-xl" />
                                        <Skeleton className="h-11 w-32 rounded-xl" />
                                        <Skeleton className="h-11 w-32 rounded-xl" />
                                    </div>
                                </div>

                                <div className="mt-6 border-t border-border/50">
                                    {/* Table Skeleton */}
                                    <div className="space-y-4 p-4">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                                                <div className="flex gap-4">
                                                    <Skeleton className="h-10 w-10 rounded-full" />
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-4 w-32 rounded-md" />
                                                        <Skeleton className="h-3 w-24 rounded-md" />
                                                    </div>
                                                </div>
                                                <Skeleton className="h-6 w-20 rounded-full" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-6 sm:gap-8">
                        {/* Sidebar Cards Skeleton */}
                        {[...Array(2)].map((_, i) => (
                            <Card key={i} className="bg-card shadow-xl border-border shrink-0 rounded-2xl">
                                <CardHeader className="border-b border-border mb-4">
                                    <Skeleton className="h-4 w-32 rounded-md" />
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {[...Array(3)].map((_, j) => (
                                        <div key={j} className="space-y-2">
                                            <div className="flex justify-between">
                                                <Skeleton className="h-3 w-20 rounded-md" />
                                                <Skeleton className="h-3 w-8 rounded-md" />
                                            </div>
                                            <Skeleton className="h-2 w-full rounded-full" />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
