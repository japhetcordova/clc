"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function AdminLogout() {
    const handleLogout = () => {
        localStorage.removeItem("clc_admin_auth");
        localStorage.removeItem("clc_is_premium");
        document.documentElement.classList.remove("premium");
        document.documentElement.removeAttribute("data-theme");
        window.location.reload();
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-full px-4"
        >
            <LogOut className="w-3 h-3 mr-2" />
            Sign Out
        </Button>
    );
}
