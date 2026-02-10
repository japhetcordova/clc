"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function ArchiveLink() {
    return (
        <div className="pt-12 text-center">
            <Link
                href="https://drive.google.com/drive/folders/13d1rw_OHwwiPMq6hJkc01Ee-RL0OoEUr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors hover:scale-105 active:scale-95"
            >
                <ExternalLink className="w-3.5 h-3.5" />
                Explore Complete Cloud Archive
            </Link>
        </div>
    );
}
