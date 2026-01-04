import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen flex flex-col">
            {/* GLOBAL DYNAMIC BACKGROUND AURA */}
            <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[50%] bg-indigo-500/10 rounded-full blur-[100px]" />
                <div className="absolute top-[40%] right-[10%] w-[20%] h-[20%] bg-amber-500/5 rounded-full blur-[80px]" />
            </div>

            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
