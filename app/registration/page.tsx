"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { registerUser, findUser } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, UserPlus, Phone, Mail, Building2, Users, ArrowRight, ArrowLeft, Heart, Sparkles, Search, LogIn } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import DigitalIDCard from "@/components/DigitalIDCard";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    gender: z.string().min(1, "Gender is required"),
    network: z.string().min(1, "Network is required"),
    cluster: z.string().min(1, "Cluster is required"),
    contactNumber: z.string().min(10, "Valid contact number is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    ministry: z.string().min(1, "Ministry is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegistrationPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"register" | "login">("register");
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registeredUser, setRegisteredUser] = useState<any>(null);

    // Login State
    const [loginFName, setLoginFName] = useState("");
    const [loginLName, setLoginLName] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        trigger,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cluster: "",
            network: "",
        },
        mode: "onChange",
    });

    const nextStep = async () => {
        const fieldsToValidate = step === 1
            ? ["firstName", "lastName", "gender", "contactNumber"]
            : ["cluster", "network", "ministry"];

        const isValid = await trigger(fieldsToValidate as any);
        if (isValid) setStep((s) => s + 1);
    };

    const prevStep = () => setStep((s) => s - 1);

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        const result = await registerUser(data);
        setIsSubmitting(false);

        if (result.success) {
            setRegisteredUser(result.user);
            if (result.alreadyExists) {
                toast.info("Welcome back!", { description: "An account with your name already exists. Redirecting to your profile..." });
                setTimeout(() => {
                    router.push(`/profile/${result.user.qrCodeId}`);
                }, 2000);
            } else {
                toast.success("Successfully registered!");
            }
        } else {
            toast.error(result.error || "Failed to register.");
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginFName || !loginLName) {
            toast.error("Please enter both names.");
            return;
        }

        setIsSearching(true);
        const result = await findUser(loginFName, loginLName);
        setIsSearching(false);

        if (result.success && result.user) {
            toast.success("Profile Found!", { description: "Redirecting to your digital ID..." });
            router.push(`/profile/${result.user.qrCodeId}`);
        } else {
            toast.error(result.error || "Profile not found.");
        }
    };

    const downloadPDF = async () => {
        if (!registeredUser) return;
        const element = document.getElementById("digital-id-card");
        if (!element) return;

        toast.loading("Generating your high-quality Digital ID...", { id: "pdf-gen" });

        try {
            const dataUrl = await toPng(element, { quality: 1.0, pixelRatio: 3, backgroundColor: '#ffffff' });
            const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [400, 600] });
            pdf.addImage(dataUrl, "PNG", 0, 0, 400, 600, undefined, "FAST");
            pdf.save(`CLC-ID-${registeredUser.firstName}-${registeredUser.lastName}.pdf`);
            toast.success("Digital ID Ready!", { id: "pdf-gen" });
        } catch (err) {
            toast.error("Failed to generate PDF.", { id: "pdf-gen" });
        }
    };

    if (registeredUser && !registeredUser.alreadyExists) {
        const profileUrl = `${registeredUser.qrCodeId}`;
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
                            <CardDescription className="text-muted-foreground font-medium">Welcome to the CLC Community, {registeredUser.firstName}!</CardDescription>
                        </CardHeader>

                        <CardContent className="flex flex-col items-center space-y-8 pt-6">
                            <div className="p-6 bg-white rounded-[2.5rem] shadow-xl ring-1 ring-border">
                                <QRCodeSVG value={profileUrl} size={180} level="H" includeMargin />
                            </div>

                            <div className="text-center space-y-4 w-full">
                                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Your Private Access Key</p>
                                <div className="flex flex-col gap-3">
                                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl text-md font-bold transition-all hover:scale-[1.02]" onClick={() => router.push(`/profile/${registeredUser.qrCodeId}`)}>
                                        Go to My Profile
                                    </Button>
                                    <Button variant="outline" className="w-full border-2 border-slate-200 h-12 rounded-xl text-md font-bold text-slate-700 hover:bg-slate-50 transition-all" onClick={downloadPDF}>
                                        Download Digital ID
                                    </Button>
                                </div>
                            </div>

                            <div className="fixed -left-[2000px] top-0 pointer-events-none">
                                <DigitalIDCard user={registeredUser} qrValue={profileUrl} />
                            </div>

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

                    <CardHeader className="space-y-4 pb-8 pt-10">
                        <div className="flex bg-muted/50 p-1 rounded-2xl w-fit mx-auto mb-4 ring-1 ring-border">
                            <button
                                onClick={() => setActiveTab("register")}
                                className={cn("px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all", activeTab === "register" ? "bg-background text-foreground shadow-lg shadow-black/5" : "text-muted-foreground hover:text-foreground")}
                            >
                                Register
                            </button>
                            <button
                                onClick={() => setActiveTab("login")}
                                className={cn("px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all", activeTab === "login" ? "bg-background text-foreground shadow-lg shadow-black/5" : "text-muted-foreground hover:text-foreground")}
                            >
                                Login
                            </button>
                        </div>

                        <div className="text-center space-y-1">
                            <CardTitle className="text-4xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                                {activeTab === "register" ? "Join Community" : "Welcome Back"}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground font-medium">
                                {activeTab === "register" ? "Create your official CLC digital profile." : "Enter your name to access your Digital ID."}
                            </CardDescription>
                        </div>
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
                                                    <Select onValueChange={(v) => { setValue("cluster", v); setValue("network", ""); }}>
                                                        <SelectTrigger className="h-12 bg-background/50 border-border text-foreground rounded-xl">
                                                            <SelectValue placeholder="Select Cluster" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-popover border-border text-popover-foreground">
                                                            <SelectItem value="Cluster 1">Cluster 1</SelectItem>
                                                            <SelectItem value="Cluster 2">Cluster 2</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2.5">
                                                    <Label className="text-foreground font-bold ml-1">Network</Label>
                                                    <Select onValueChange={(v) => setValue("network", v)} disabled={!watch("cluster")}>
                                                        <SelectTrigger className="h-12 bg-background/50 border-border text-foreground rounded-xl">
                                                            <SelectValue placeholder={watch("cluster") ? "Select network" : "Choose cluster first"} />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-popover border-border text-popover-foreground">
                                                            {watch("cluster") === "Cluster 1" && watch("gender") === "Male" && ["Grenadier", "Better You", "Overcomers", "Kingdom Souldiers", "Light-bearers"].map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                                                            {watch("cluster") === "Cluster 1" && watch("gender") === "Female" && ["WOW", "Loved", "Phoenix", "Conquerors", "Pearls", "Dauntless", "Royalties"].map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                                                            {watch("cluster") === "Cluster 2" && watch("gender") === "Male" && ["Bravehearts", "Astig", "Transformer", "Invincible", "Generals", "Champs", "Unbreakable multiplier"].map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                                                            {watch("cluster") === "Cluster 2" && watch("gender") === "Female" && ["Exemplary", "Gems", "Diamonds", "Bride", "Fab", "Triumphant", "Visionary"].map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="space-y-2.5">
                                                <Label className="text-foreground font-bold ml-1">Ministry Involvement</Label>
                                                <Select onValueChange={(v) => setValue("ministry", v)}>
                                                    <SelectTrigger className="h-12 bg-background/50 border-border text-foreground rounded-xl">
                                                        <SelectValue placeholder="Select ministry" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-popover border-border text-popover-foreground">
                                                        <SelectItem value="Worship Team">Worship Team</SelectItem>
                                                        <SelectItem value="Media">Media</SelectItem>
                                                        <SelectItem value="Usher">Usher</SelectItem>
                                                        <SelectItem value="Marshal">Marshal</SelectItem>
                                                        <SelectItem value="Production">Production</SelectItem>
                                                        <SelectItem value="Kid's Church">Kid's Church</SelectItem>
                                                        <SelectItem value="Technical">Technical</SelectItem>
                                                        <SelectItem value="PA">PA</SelectItem>
                                                        <SelectItem value="Finance">Finance</SelectItem>
                                                        <SelectItem value="Arete">Arete</SelectItem>
                                                        <SelectItem value="Hosting">Hosting</SelectItem>
                                                        <SelectItem value="Writer">Writer</SelectItem>
                                                    </SelectContent>
                                                </Select>
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
                                        {isSearching ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                            <>
                                                <Search className="w-6 h-6" />
                                                Find My ID
                                            </>
                                        )}
                                    </Button>

                                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
                                        <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <p className="text-xs font-medium text-muted-foreground leading-relaxed">Forgot your ID? No problem. Simply enter your registered name to retrieve your official CLC digital profile.</p>
                                    </div>
                                </motion.div>
                            </form>
                        )}
                    </CardContent>
                </Card>

                <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
                    <Heart className="w-4 h-4 fill-muted-foreground" />
                    <span className="text-xs font-bold uppercase tracking-wider italic">Designed for CLC Life</span>
                </div>
            </motion.div>
        </div>
    );
}

function Loader2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M4.93 4.93l2.83 2.83" />
            <path d="M16.24 16.24l2.83 2.83" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <path d="M4.93 19.07l2.83-2.83" />
            <path d="M16.24 7.76l2.83-2.83" />
        </svg>
    )
}
