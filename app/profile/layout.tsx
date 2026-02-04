import Navbar from "@/components/Navbar";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen flex flex-col">
            <div className="hidden md:block">
                <Navbar />
            </div>
            <main className="flex-1 md:pt-20">
                {children}
            </main>
        </div>
    );
}
