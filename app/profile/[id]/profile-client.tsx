"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { FileDown, Check, Palette, Eye } from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import DigitalIDCard from "@/components/DigitalIDCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface ProfileClientProps {
    user: {
        firstName: string;
        lastName: string;
        network: string;
        ministry: string;
        qrCodeId: string;
    };
    qrValue: string;
}

function useMediaQuery(query: string) {
    const [value, setValue] = useState(false);

    useEffect(() => {
        function onChange(event: MediaQueryListEvent) {
            setValue(event.matches);
        }

        const result = matchMedia(query);
        result.addEventListener("change", onChange);
        setValue(result.matches);

        return () => result.removeEventListener("change", onChange);
    }, [query]);

    return value;
}

export function ProfileIDPreview({ user, qrValue, trigger }: ProfileClientProps & { trigger?: React.ReactNode }) {
    const profileUrl = typeof window !== "undefined" ? `${window.location.origin}/profile/${qrValue}` : "";
    const [bgVariant, setBgVariant] = useState(0);
    const isDark = bgVariant === 0 || bgVariant === 2;
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const downloadPNG = async () => {
        const element = document.getElementById("digital-id-card-preview");
        if (!element) return;

        toast.loading("Generating your high-quality Digital ID...", { id: "id-gen-profile" });

        try {
            const dataUrl = await toPng(element, {
                quality: 1.0,
                pixelRatio: 4,
                backgroundColor: isDark ? '#020617' : '#ffffff'
            });

            const link = document.createElement('a');
            link.download = `CLC-ID-${user.firstName}-${user.lastName}.png`;
            link.href = dataUrl;
            link.click();

            toast.success("Digital ID Ready!", { id: "id-gen-profile" });
            setOpen(false);
        } catch (err) {
            toast.error("Failed to generate ID image.", { id: "id-gen-profile" });
        }
    };

    const bgOptions = [
        { id: 0, name: "Onyx Minimal", color: "bg-[#020617]" },
        { id: 1, name: "Celestial", image: "/1.webp" },
        { id: 2, name: "Ethereal", image: "/2.webp" },
        { id: 3, name: "Prism", image: "/3.webp" },
    ];

    const Content = () => (
        <div className="flex flex-col lg:grid lg:grid-cols-[55%_45%] h-full">
            {/* Preview Area */}
            <div className="p-0 sm:p-8 flex items-center justify-center bg-muted/20 border-b lg:border-b-0 lg:border-r border-border/50 relative min-h-[460px] lg:min-h-0">
                <div className="hidden sm:flex absolute top-6 left-8 items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Live Preview</span>
                </div>

                <div className="relative w-full h-full flex items-center justify-center py-6 lg:py-0">
                    <div className="scale-[0.85] xs:scale-[0.9] sm:scale-[1] md:scale-[0.8] lg:scale-[0.9] origin-center shadow-2xl rounded-[3rem] overflow-hidden transition-all duration-300">
                        <div id="digital-id-card-preview">
                            <DigitalIDCard
                                user={user}
                                qrValue={profileUrl}
                                backgroundVariant={bgVariant}
                                isDark={isDark}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Customization Area */}
            <div className="p-6 sm:p-10 space-y-8 flex flex-col bg-background h-fit lg:h-full lg:overflow-y-auto">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        {isDesktop ? (
                            <DialogHeader>
                                <DialogTitle className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter">Customize ID</DialogTitle>
                            </DialogHeader>
                        ) : (
                            <DrawerHeader className="p-0 text-left">
                                <DrawerTitle className="text-2xl font-black italic uppercase tracking-tighter">Customize ID</DrawerTitle>
                            </DrawerHeader>
                        )}
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm font-medium">Select your premium theme.</p>
                    <div className="h-[2px] w-12 bg-primary rounded-full transition-all group-hover:w-20" />
                </div>

                <div className="space-y-8">
                    <div className="space-y-4 pb-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                            <Palette className="w-3 h-3" />
                            Background Art
                        </label>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 font-sans">
                            {bgOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setBgVariant(opt.id)}
                                    className={cn(
                                        "group relative aspect-[3/2] rounded-2xl overflow-hidden transition-all isolate",
                                        bgVariant === opt.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-xl scale-[1.03] z-10" : "opacity-60 hover:opacity-100"
                                    )}
                                >
                                    {opt.id === 0 ? (
                                        <div className={cn("w-full h-full bg-[#020617] relative rounded-[inherit]")}>
                                            <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 to-transparent" />
                                        </div>
                                    ) : (
                                        <img src={opt.image} alt={opt.name} className="w-full h-full object-cover rounded-[inherit]" />
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 bg-black/80 backdrop-blur-sm p-2 rounded-b-[inherit]">
                                        <p className="text-[8px] sm:text-[9px] font-bold text-white uppercase text-center">{opt.name}</p>
                                    </div>
                                    {bgVariant === opt.id && (
                                        <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full shadow-lg z-20">
                                            <Check className="w-2.5 h-2.5" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <Button
                    onClick={downloadPNG}
                    className="w-full h-14 sm:h-16 rounded-3xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all mt-auto mb-2"
                >
                    <FileDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                    Download
                </Button>
            </div>
        </div>
    );

    const TriggerButton = () => (
        <Button variant="outline" className="w-full border-2 border-primary/10 hover:bg-primary/5 rounded-2xl font-black flex items-center justify-center gap-3 px-6 h-10 uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-black/5 hover:scale-[1.02] active:scale-95 transition-all">
            <Eye className="w-4 h-4 text-primary" />
            Download ID
        </Button>
    );

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {trigger || <TriggerButton />}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[1000px] w-[95vw] h-[90vh] lg:h-[750px] overflow-hidden p-0 border-none bg-background/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl block">
                    <Content />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {trigger || <TriggerButton />}
            </DrawerTrigger>
            <DrawerContent className="max-h-[96vh] rounded-t-[2.5rem]">
                <div className="overflow-y-auto">
                    <Content />
                </div>
            </DrawerContent>
        </Drawer>
    );
}

export default function ProfileQRCode({ user, qrValue }: ProfileClientProps) {
    const profileUrl = typeof window !== "undefined" ? `${window.location.origin}/profile/${qrValue}` : "";

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
            {/* Main QR Display */}
            <div className="relative group w-full">
                <div className="absolute -inset-4 bg-linear-to-r from-primary/20 to-rose-500/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-6 bg-white rounded-[2.5rem] shadow-xl ring-1 ring-border flex justify-center">
                    <QRCodeSVG value={profileUrl || qrValue} size={180} level="H" includeMargin />
                </div>
            </div>
        </div>
    );
}
