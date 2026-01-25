"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success("Subscribed!", {
            description: "You've been added to our digital bulletin."
        });
        setEmail("");
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center pt-4 w-full">
            <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="h-14 px-8 rounded-2xl bg-white/10 border border-white/20 placeholder:text-white/40 focus:outline-none focus:ring-2 ring-white/50 w-full sm:w-96 font-medium text-white"
            />
            <Button
                type="submit"
                disabled={isLoading}
                className="h-14 px-10 rounded-2xl bg-white text-rose-600 font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all shrink-0"
            >
                {isLoading ? "Subscribing..." : "Notify Me"}
            </Button>
        </form>
    );
}
