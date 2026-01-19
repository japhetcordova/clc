"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, Loader2, X, User, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

export default function MemberSearch() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get("search") || "";

    const [query, setQuery] = useState(initialSearch);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Debounce query for API
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Fetch suggestions
    const { data: suggestions, isLoading } = trpc.getMemberSuggestions.useQuery(
        { query: debouncedQuery },
        { enabled: debouncedQuery.length >= 2 }
    );

    // Handle outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }
        params.delete("page"); // Reset pagination
        router.push(`${pathname}?${params.toString()}`);
        setIsOpen(false);
    };

    const onSelectSuggestion = (suggestion: any) => {
        const fullName = `${suggestion.firstName} ${suggestion.lastName}`;
        setQuery(fullName);
        handleSearch(fullName);
    };

    const clearSearch = () => {
        setQuery("");
        handleSearch("");
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch(query);
            setIsOpen(false);
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                    className="pl-9 pr-10 h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-colors rounded-xl"
                    placeholder="Search by name, ID, or ministry..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                />
                {query && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
                        onClick={clearSearch}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && debouncedQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-popover/95 backdrop-blur-md border border-border shadow-2xl rounded-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-4 text-muted-foreground text-xs gap-2">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Searching...
                            </div>
                        ) : suggestions && suggestions.length > 0 ? (
                            <div className="space-y-0.5">
                                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 select-none">
                                    Suggestions
                                </div>
                                {suggestions.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => onSelectSuggestion(user)}
                                        className="w-full flex items-center justify-between p-2.5 hover:bg-muted/50 rounded-lg group transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <User className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground truncate">
                                                    <span className="font-mono bg-muted px-1 rounded">{user.qrCodeId}</span>
                                                    <span>•</span>
                                                    <span className="truncate">{user.ministry}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground/0 group-hover:text-muted-foreground/50 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center space-y-2">
                                <p className="text-sm font-medium text-foreground">No results found</p>
                                <p className="text-xs text-muted-foreground">Try searching for something else</p>
                            </div>
                        )}

                        {!isLoading && suggestions && suggestions.length > 0 && (
                            <div className="border-t border-border/50 mt-1 pt-1">
                                <button
                                    onClick={() => {
                                        handleSearch(query);
                                        setIsOpen(false);
                                    }}
                                    className="w-full p-2 text-xs font-medium text-center text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                >
                                    View all results using "{query}"
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
