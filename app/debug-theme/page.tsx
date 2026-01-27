"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugThemePage() {
    const [isPremium, setIsPremium] = useState<string | null>(null);
    const [hasClass, setHasClass] = useState(false);
    const [currentTheme, setCurrentTheme] = useState<string | null>(null);

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = () => {
        const premium = localStorage.getItem("clc_is_premium");
        setIsPremium(premium);
        setHasClass(document.documentElement.classList.contains("premium"));
        setCurrentTheme(document.documentElement.getAttribute("data-theme"));
    };

    const clearPremium = () => {
        localStorage.removeItem("clc_is_premium");
        document.documentElement.classList.remove("premium");
        document.documentElement.removeAttribute("data-theme");
        checkStatus();
        window.location.reload();
    };

    const setPremiumMode = () => {
        localStorage.setItem("clc_is_premium", "true");
        document.documentElement.classList.add("premium");
        document.documentElement.setAttribute("data-theme", "premium");
        checkStatus();
        window.location.reload();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <Card className="max-w-2xl w-full">
                <CardHeader>
                    <CardTitle className="text-2xl font-black uppercase">Theme Debug Tool</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Current Status:</h3>

                        <div className="space-y-2 font-mono text-sm">
                            <div className="p-3 bg-muted rounded-lg">
                                <strong>localStorage['clc_is_premium']:</strong>{" "}
                                <span className={isPremium === "true" ? "text-amber-500" : "text-green-500"}>
                                    {isPremium || "null"}
                                </span>
                            </div>

                            <div className="p-3 bg-muted rounded-lg">
                                <strong>document.classList.contains('premium'):</strong>{" "}
                                <span className={hasClass ? "text-amber-500" : "text-green-500"}>
                                    {hasClass ? "true" : "false"}
                                </span>
                            </div>

                            <div className="p-3 bg-muted rounded-lg">
                                <strong>data-theme attribute:</strong>{" "}
                                <span className={currentTheme === "premium" ? "text-amber-500" : "text-green-500"}>
                                    {currentTheme || "null"}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
                            <p className="text-sm font-bold">
                                Expected Theme: <span className="text-primary text-lg">{isPremium === "true" ? "PREMIUM (Amber/Indigo)" : "ORIGINAL (Green)"}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            onClick={clearPremium}
                            variant="destructive"
                            className="flex-1 h-14 font-black uppercase"
                        >
                            Clear Premium & Reset to Green
                        </Button>

                        <Button
                            onClick={setPremiumMode}
                            className="flex-1 h-14 font-black uppercase bg-amber-500 hover:bg-amber-400"
                        >
                            Enable Premium Mode
                        </Button>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1 p-4 bg-muted/50 rounded-lg">
                        <p><strong>Instructions:</strong></p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Click "Clear Premium & Reset to Green" to remove premium status</li>
                            <li>The page will reload automatically</li>
                            <li>You should now see the green color scheme everywhere</li>
                            <li>Visit any other page to confirm the green theme persists</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
