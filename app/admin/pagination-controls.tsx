"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaginationControls({
    currentPage,
    totalPages
}: {
    currentPage: number;
    totalPages: number;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between sm:justify-end gap-4 py-4 border-t border-border/50 mt-4 px-4 bg-muted/10 rounded-b-[2rem]">
            <span className="text-[10px] sm:text-xs text-muted-foreground font-black uppercase tracking-widest">
                Showing Page {currentPage} of {totalPages}
            </span>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="h-8 w-8 rounded-xl bg-background border-border shadow-sm hover:bg-primary/5 hover:text-primary transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="h-8 w-8 rounded-xl bg-background border-border shadow-sm hover:bg-primary/5 hover:text-primary transition-colors"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
