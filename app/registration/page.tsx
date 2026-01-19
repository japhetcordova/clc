"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, UserPlus, Phone, Mail, Building2, Users, ArrowRight, ArrowLeft, Heart, Sparkles, Search, LogIn, QrCode, Scan, Palette, Moon, Sun, Monitor, Eye, FileDown, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { toPng } from "html-to-image";
import DigitalIDCard from "@/components/DigitalIDCard";
import { useRouter } from "next/navigation";
import ConcernNote from "@/components/ConcernNote";
import { ClusterSelect, NetworkSelect, MinistrySelect } from "@/components/ChurchFormFields";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const formSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    gender: z.string().min(1, "Gender is required"),
    network: z.string().min(1, "Network is required"),
    cluster: z.string().min(1, "Cluster is required"),
    contactNumber: z.string().min(10, "Valid contact number is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    ministry: z.string().min(1, "Ministry is required")
});

type FormValues = z.infer<typeof formSchema>;

export default function RegistrationPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [activeTab, setActiveTab] = useState<"register" | "login" | any>("register");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registeredUser, setRegisteredUser] = useState<{ firstName: string; lastName: string; qrCodeId: string; ministry: string; network: string; alreadyExists?: boolean; cluster: string } | null>(null);

    // Login State
    const [loginFName, setLoginFName] = useState("");
    const [loginLName, setLoginLName] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const registerMutation = trpc.registerUser.useMutation();
    const findMutation = trpc.findUser.useMutation();

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            gender: "",
            cluster: "",
            network: "",
            ministry: ""
        }
    });

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            const result = await registerMutation.mutateAsync(data);
            if (result.success && result.user) {
                setRegisteredUser({
                    firstName: result.user.firstName,
                    lastName: result.user.lastName,
                    qrCodeId: result.user.qrCodeId,
                    ministry: result.user.ministry || "None",
                    network: result.user.network || "None",
                    cluster: result.user.cluster || "None",
                    alreadyExists: result.alreadyExists
                });
                if (result.alreadyExists) {
                    toast.info("User already registered. Taking you to your profile.");
                } else {
                    toast.success("Registration successful!");
                }
            } else {
                toast.error((result as any).error || "failed to register.");
            }
        } catch (err) {
            toast.error("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => {
        const fName = watch("firstName");
        const lName = watch("lastName");
        const gender = watch("gender");
        const contact = watch("contactNumber");

        if (!fName || !lName || !gender || !contact) {
            toast.error("Please fill in all details.");
            return;
        }
        setStep(2);
    };

    const prevStep = () => setStep(1);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginFName || !loginLName) {
            toast.error("Please enter both names.");
            return;
        }

        setIsSearching(true);
        const result = await findMutation.mutateAsync({ firstName: loginFName, lastName: loginLName });
        setIsSearching(false);

        if (result.success && result.user) {
            router.push(`/profile/${result.user.qrCodeId}`);
        } else {
            toast.error(result.error || "Profile not found.");
        }
    };

    const [bgVariant, setBgVariant] = useState(0);
    // Auto-set theme: Onyx (0) and Ethereal (2) use Dark Mode (White Text), others use Light Mode (Dark Text)
    const isDark = bgVariant === 0 || bgVariant === 2;
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const downloadPNG = async () => {
        if (!registeredUser) return;
        const element = document.getElementById("digital-id-card-preview");
        if (!element) return;

        toast.loading("Generating your high-quality Digital ID...", { id: "id-gen" });

        try {
            const dataUrl = await toPng(element, { quality: 1.0, pixelRatio: 4, backgroundColor: isDark ? '#020617' : '#ffffff' });
            const link = document.createElement('a');
            link.download = `CLC-ID-${registeredUser.firstName}-${registeredUser.lastName}.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Digital ID Ready!", { id: "id-gen" });
            setIsPreviewOpen(false);
        } catch (err) {
            toast.error("Failed to generate ID image.", { id: "id-gen" });
        }
    };

    const bgOptions = [
        { id: 0, name: "Onyx Minimal", color: "bg-[#020617]" },
        { id: 1, name: "Celestial", image: "/1.png" },
        { id: 2, name: "Ethereal", image: "/2.png" },
        { id: 3, name: "Prism", image: "/3.png" },
    ];

    if (registeredUser && !registeredUser.alreadyExists) {
        const profileUrl = typeof window !== "undefined" ? `${window.location.origin}/profile/${registeredUser.qrCodeId}` : "";
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-b from-background via-emerald-500/5 to-background">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
                    <Card className="border-none shadow-2xl bg-card/60 backdrop-blur-xl overflow-hidden ring-1 ring-border">
                        <div className="h-2 bg-emerald-500" />
                        <CardHeader className="text-center space-y-2 pb-2">
                            <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </div>
                            <CardTitle className="text-3xl font-black text-foreground">Registration Complete!</CardTitle>
                            <CardDescription className="text-muted-foreground font-medium">Welcome to Christian Life Center, {registeredUser.firstName}!</CardDescription>
                        </CardHeader>

                        <CardContent className="flex flex-col items-center space-y-8 pt-6">
                            <div className="relative z-10 p-6 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-slate-100">
                                <QRCodeSVG value={profileUrl} size={200} level="H" includeMargin={true} />
                            </div>

                            <div className="text-center space-y-4 w-full">
                                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Your Private Access Key</p>
                                <div className="flex flex-col gap-3">
                                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl text-md font-bold transition-all hover:scale-[1.02]" onClick={() => router.push(`/profile/${registeredUser.qrCodeId}`)}>
                                        Go to My Profile
                                    </Button>

                                    <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="w-full border-2 border-slate-200 h-12 rounded-xl text-md font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                                <Eye className="w-4 h-4" />
                                                Preview & Customize ID
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[1000px] w-[95vw] h-[90vh] lg:h-[750px] overflow-hidden p-0 border-none bg-background/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl flex flex-col sm:block">
                                            <div className="flex flex-col lg:grid lg:grid-cols-[55%_45%] h-full">

                                                {/* Preview Area - Tightened Spacing */}
                                                <div className="p-4 sm:p-8 flex items-center justify-center bg-muted/20 border-b lg:border-b-0 lg:border-r border-border/50 relative min-h-[400px] lg:min-h-0 text-center">
                                                    <div className="hidden sm:flex absolute top-6 left-8 items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Live Preview</span>
                                                    </div>

                                                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                                                        <div className="scale-[0.5] xs:scale-[0.6] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.9] origin-center shadow-2xl rounded-[3rem] overflow-hidden transition-all duration-300">
                                                            <div id="digital-id-card-preview">
                                                                <DigitalIDCard
                                                                    user={registeredUser}
                                                                    qrValue={profileUrl}
                                                                    backgroundVariant={bgVariant}
                                                                    isDark={isDark}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Customization Area */}
                                                <div className="p-6 sm:p-8 space-y-8 flex flex-col bg-background h-fit lg:h-full lg:overflow-y-auto">
                                                    <div className="space-y-4">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter">Customize ID</DialogTitle>
                                                            <p className="text-muted-foreground text-[10px] sm:text-xs font-medium">Personalize your digital access pass.</p>
                                                        </DialogHeader>
                                                        <div className="h-[2px] w-12 bg-primary rounded-full" />
                                                    </div>

                                                    <div className="space-y-6 flex-1">

                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                                                <Palette className="w-3 h-3" />
                                                                Background Art
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                {bgOptions.map((opt) => (
                                                                    <button
                                                                        key={opt.id}
                                                                        onClick={() => setBgVariant(opt.id)}
                                                                        className={cn(
                                                                            "group relative aspect-[3/2] rounded-xl overflow-hidden transition-all isolate",
                                                                            bgVariant === opt.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-md z-10 scale-105" : "opacity-60 hover:opacity-100"
                                                                        )}
                                                                    >
                                                                        {opt.id === 0 ? <div className="w-full h-full bg-[#020617] rounded-[inherit]" /> : <img src={opt.image} className="w-full h-full object-cover rounded-[inherit]" />}
                                                                        <div className="absolute inset-x-0 bottom-0 bg-black/80 backdrop-blur-sm p-1.5 rounded-b-[inherit]"><p className="text-[8px] font-bold text-white uppercase text-center">{opt.name}</p></div>
                                                                        {bgVariant === opt.id && <div className="absolute top-1 right-1 bg-primary text-white p-0.5 rounded-full z-20"><Check className="w-2 h-2" /></div>}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Button onClick={downloadPNG} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all mt-auto">
                                                        <FileDown className="w-4 h-4" />
                                                        Download PNG
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <div className="w-full grid grid-cols-2 gap-4 mt-2">
                                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                            <span className="block text-[10px] font-bold text-slate-400 uppercase">Network</span>
                                            <span className="font-bold text-slate-700">{registeredUser.network}</span>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                            <span className="block text-[10px] font-bold text-slate-400 uppercase">Ministry</span>
                                            <span className="font-bold text-slate-700">{registeredUser.ministry}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-b from-background via-primary/5 to-background overflow-hidden relative">
            <div className="absolute -top-24 -left-20 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute -bottom-24 -right-20 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[120px]" />

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg relative z-10">
                <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] bg-card/80 backdrop-blur-3xl ring-1 ring-border overflow-hidden">
                    {activeTab === "register" && (
                        <div className="h-1.5 w-full bg-muted flex">
                            <motion.div initial={{ width: "0%" }} animate={{ width: step === 1 ? "50%" : "100%" }} className="h-full bg-linear-to-r from-primary to-accent" />
                        </div>
                    )}

                    <CardHeader className="space-y-4 pb-4 pt-6 sm:pb-8 sm:pt-10">
                        <div className="flex bg-muted/50 p-1 rounded-2xl w-full sm:w-fit mx-auto mb-4 ring-1 ring-border">
                            <button
                                onClick={() => setActiveTab("register")}
                                className={cn("flex-1 sm:flex-none px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all", activeTab === "register" ? "bg-background text-foreground shadow-lg shadow-black/5" : "text-muted-foreground hover:text-foreground")}
                            >
                                Register
                            </button>
                            <button
                                onClick={() => setActiveTab("login")}
                                className={cn("flex-1 sm:flex-none px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all", activeTab === "login" ? "bg-background text-foreground shadow-lg shadow-black/5" : "text-muted-foreground hover:text-foreground")}
                            >
                                Login
                            </button>
                        </div>

                        <div className="text-center space-y-1">
                            <CardTitle className="text-2xl sm:text-4xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                                {activeTab === "register" ? "Join Christian Life Center" : "Welcome Back"}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground font-medium text-xs sm:text-base">
                                {activeTab === "register" ? "Create your official Christian Life Center digital profile." : "Enter your name to access your Digital ID."}
                            </CardDescription>
                        </div>

                        {activeTab === "register" && (
                            <div className="pt-6 mt-2 border-t border-border/50">
                                <div className="relative grid grid-cols-3 gap-2">
                                    <div className="absolute top-5 left-[16%] right-[16%] h-0.5 bg-border/50 -z-10" />

                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col items-center text-center space-y-2 group cursor-default">
                                        <div className="relative w-12 h-12 rounded-2xl bg-background flex items-center justify-center ring-1 ring-border group-hover:ring-primary/50 group-hover:bg-primary/5 transition-all shadow-sm">
                                            <span className="absolute top-1 right-2 text-[9px] font-black text-muted-foreground/30">01</span>
                                            <UserPlus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                                        </div>
                                        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Fill Form</p>
                                    </motion.div>

                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col items-center text-center space-y-2 group cursor-default">
                                        <div className="relative w-12 h-12 rounded-2xl bg-background flex items-center justify-center ring-1 ring-border group-hover:ring-primary/50 group-hover:bg-primary/5 transition-all shadow-sm">
                                            <span className="absolute top-1 right-2 text-[9px] font-black text-muted-foreground/30">02</span>
                                            <QrCode className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                                        </div>
                                        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Get ID</p>
                                    </motion.div>

                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col items-center text-center space-y-2 group cursor-default">
                                        <div className="relative w-12 h-12 rounded-2xl bg-background flex items-center justify-center ring-1 ring-border group-hover:ring-primary/50 group-hover:bg-primary/5 transition-all shadow-sm">
                                            <span className="absolute top-1 right-2 text-[9px] font-black text-muted-foreground/30">03</span>
                                            <Scan className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                                        </div>
                                        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Scan Entry</p>
                                    </motion.div>
                                </div>
                            </div>
                        )}
                    </CardHeader>

                    <CardContent className="pb-10">
                        {activeTab === "register" ? (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <AnimatePresence mode="wait">
                                    {step === 1 ? (
                                        <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                <div className="space-y-2.5">
                                                    <Label htmlFor="firstName" className="text-foreground font-bold ml-1">First Name</Label>
                                                    <Input id="firstName" placeholder="Given name" className="h-12 bg-background/50 border-border text-foreground rounded-xl focus:ring-2 focus:ring-primary transition-all" {...register("firstName")} />
                                                    {errors.firstName && <p className="text-xs font-bold text-destructive ml-1">{errors.firstName.message}</p>}
                                                </div>
                                                <div className="space-y-2.5">
                                                    <Label htmlFor="lastName" className="text-foreground font-bold ml-1">Last Name</Label>
                                                    <Input id="lastName" placeholder="Family name" className="h-12 bg-background/50 border-border text-foreground rounded-xl focus:ring-2 focus:ring-primary transition-all" {...register("lastName")} />
                                                    {errors.lastName && <p className="text-xs font-bold text-destructive ml-1">{errors.lastName.message}</p>}
                                                </div>
                                            </div>

                                            <div className="space-y-2.5">
                                                <Label className="text-foreground font-bold ml-1">Gender</Label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button type="button" onClick={() => setValue("gender", "Male")} className={cn("h-12 rounded-xl font-bold transition-all border-2", watch("gender") === "Male" ? "bg-primary/10 border-primary text-foreground" : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted")}>Male</button>
                                                    <button type="button" onClick={() => setValue("gender", "Female")} className={cn("h-12 rounded-xl font-bold transition-all border-2", watch("gender") === "Female" ? "bg-primary/10 border-primary text-foreground" : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted")}>Female</button>
                                                </div>
                                                {errors.gender && <p className="text-xs font-bold text-destructive ml-1">{errors.gender.message}</p>}
                                            </div>

                                            <div className="space-y-2.5">
                                                <Label htmlFor="contactNumber" className="text-foreground font-bold ml-1">WhatsApp / Phone</Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                    <Input id="contactNumber" className="h-12 pl-12 bg-background/50 border-border text-foreground rounded-xl focus:ring-2 focus:ring-primary transition-all" placeholder="09XX XXX XXXX" {...register("contactNumber")} />
                                                </div>
                                                {errors.contactNumber && <p className="text-xs font-bold text-destructive ml-1">{errors.contactNumber.message}</p>}
                                            </div>

                                            <Button type="button" onClick={nextStep} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 text-lg font-black transition-all group shadow-lg shadow-primary/10">
                                                Continue
                                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                                                <div className="space-y-2.5">
                                                    <Label className="text-foreground font-bold ml-1">Cluster</Label>
                                                    <ClusterSelect value={watch("cluster")} onValueChange={(v) => { setValue("cluster", v); setValue("network", ""); }} />
                                                </div>
                                                <div className="space-y-2.5">
                                                    <Label className="text-foreground font-bold ml-1">Network</Label>
                                                    <NetworkSelect cluster={watch("cluster")} gender={watch("gender")} value={watch("network")} onValueChange={(v) => setValue("network", v)} />
                                                </div>
                                            </div>

                                            <div className="space-y-2.5">
                                                <Label className="text-foreground font-bold ml-1">Ministry Involvement</Label>
                                                <MinistrySelect value={watch("ministry")} onValueChange={(v) => setValue("ministry", v)} />
                                            </div>

                                            <div className="space-y-2.5">
                                                <Label htmlFor="email" className="text-foreground font-bold ml-1">Email (Optional)</Label>
                                                <Input id="email" type="email" placeholder="your@email.com" className="h-12 bg-background/50 border-border text-foreground rounded-xl focus:ring-2 focus:ring-primary transition-all" {...register("email")} />
                                            </div>

                                            <div className="grid grid-cols-4 gap-3 pt-2">
                                                <Button type="button" variant="ghost" onClick={prevStep} className="h-14 rounded-2xl bg-muted hover:bg-muted/80 text-foreground font-bold transition-all"><ArrowLeft className="w-6 h-6" /></Button>
                                                <Button type="submit" disabled={isSubmitting} className="col-span-3 h-14 rounded-2xl bg-primary hover:opacity-90 text-primary-foreground text-lg font-black transition-all shadow-lg shadow-primary/20">
                                                    {isSubmitting ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" /> : "Complete Registration"}
                                                </Button>
                                            </div>
                                            <ConcernNote />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        ) : (
                            <form onSubmit={handleLogin} className="space-y-6">
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                                    <div className="space-y-4">
                                        <div className="space-y-2.5">
                                            <Label className="text-foreground font-bold ml-1">First Name</Label>
                                            <div className="relative">
                                                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                <Input value={loginFName} onChange={(e) => setLoginFName(e.target.value)} placeholder="Enter given name" className="h-14 pl-12 bg-background/50 border-border text-foreground rounded-2xl focus:ring-2 focus:ring-primary transition-all text-lg font-medium" />
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <Label className="text-foreground font-bold ml-1">Last Name</Label>
                                            <div className="relative">
                                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                <Input value={loginLName} onChange={(e) => setLoginLName(e.target.value)} placeholder="Enter family name" className="h-14 pl-12 bg-background/50 border-border text-foreground rounded-2xl focus:ring-2 focus:ring-primary transition-all text-lg font-medium" />
                                            </div>
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={isSearching} className="w-full h-16 rounded-[2rem] bg-slate-900 text-white hover:bg-slate-800 text-xl font-black transition-all shadow-2xl flex items-center justify-center gap-3">
                                        {isSearching ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full" /> : (
                                            <>
                                                <Search className="w-6 h-6" />
                                                Find My ID
                                            </>
                                        )}
                                    </Button>

                                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col gap-2">
                                        <div className="flex items-start gap-3">
                                            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            <p className="text-xs font-medium text-muted-foreground leading-relaxed">Forgot your ID? No problem. Simply enter your registered name to retrieve your official Christian Life Center digital profile.</p>
                                        </div>
                                        <ConcernNote variant="primary" />
                                    </div>
                                </motion.div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
