import React from "react";

export default function Footer() {
    return (
        <footer className="py-8 px-4 border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
            <div className="max-w-7xl mx-auto text-center space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    © 2024 Christian Life Center Tagum City | All Rights Reserved | Crafted by{" "}
                    <a
                        href="https://japhetcordova.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4"
                    >
                        CoreDova
                    </a>
                </p>
            </div>
        </footer>
    );
}
