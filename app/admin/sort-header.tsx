"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortHeaderProps {
    label: string;
    sortKey: string;
    currentSort?: string;
    currentOrder?: "asc" | "desc";
    paramKey?: string;
    orderParamKey?: string;
    className?: string;
}

export function SortHeader({
    label,
    sortKey,
    currentSort,
    currentOrder,
    paramKey = "sort",
    orderParamKey = "order",
    className
}: SortHeaderProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSort = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (currentSort === sortKey) {
            // Toggle order
            params.set(orderParamKey, currentOrder === "asc" ? "desc" : "asc");
        } else {
            // New sort key
            params.set(paramKey, sortKey);
            params.set(orderParamKey, "desc"); // Default to desc for new keys
        }

        // Reset page to 1 when sorting changes
        params.delete("page");

        router.push(`?${params.toString()}`, { scroll: false });
    };

    const isActive = currentSort === sortKey;

    return (
        <div
            onClick={handleSort}
            className={cn(
                "flex items-center gap-1 cursor-pointer hover:text-primary transition-colors group select-none",
                isActive && "text-primary",
                className
            )}
        >
            <span className="truncate">{label}</span>
            <div className="flex items-center">
                {isActive ? (
                    currentOrder === "asc" ? (
                        <ChevronUp className="w-3 h-3 transition-transform animate-in fade-in" />
                    ) : (
                        <ChevronDown className="w-3 h-3 transition-transform animate-in fade-in" />
                    )
                ) : (
                    <ChevronsUpDown className="w-3 h-3 opacity-20 group-hover:opacity-100 transition-opacity" />
                )}
            </div>
        </div>
    );
}
