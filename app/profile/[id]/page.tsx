import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { User, Phone, Mail, Building2, Users as UsersIcon, MapPin } from "lucide-react";
import ProfileClient from "@/app/profile/[id]/profile-client"; // Client component for QR generation

export default async function ProfilePage({ params }: { params: { id: string } }) {
    const { id } = await params;

    const [user] = await db.select().from(users).where(eq(users.qrCodeId, id)).limit(1);

    if (!user) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-background via-muted/50 to-background flex items-center justify-center p-4 transition-colors duration-300">
            <div className="w-full max-w-md">
                <Card className="border-none shadow-2xl bg-card/60 backdrop-blur-xl overflow-hidden ring-1 ring-border">
                    <div className="h-32 bg-linear-to-r from-primary/20 to-primary/10 flex items-end justify-center pb-6">
                        <div className="w-24 h-24 rounded-full bg-background border-4 border-background flex items-center justify-center shadow-lg -mb-12 ring-1 ring-border">
                            <User className="w-12 h-12 text-primary" />
                        </div>
                    </div>

                    <CardHeader className="pt-16 text-center pb-2">
                        <CardTitle className="text-3xl font-black text-foreground">{user.firstName} {user.lastName}</CardTitle>
                        <CardDescription className="text-primary font-black uppercase tracking-widest text-xs px-4 py-1.5 bg-primary/10 rounded-full inline-block mx-auto mt-2 italic">
                            {user.ministry}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="pt-4 flex justify-center">
                            <ProfileClient
                                user={{
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    network: user.network,
                                    ministry: user.ministry,
                                    qrCodeId: user.qrCodeId
                                }}
                                qrValue={id}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-border">
                            <div className="flex items-center gap-4 group">
                                <div className="bg-primary/5 p-3 rounded-2xl ring-1 ring-primary/10 group-hover:bg-primary/10 transition-colors">
                                    <UsersIcon className="w-5 h-5 text-primary" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Network</p>
                                    <p className="text-md font-bold text-foreground leading-tight">{user.network}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="bg-primary/5 p-3 rounded-2xl ring-1 ring-primary/10 group-hover:bg-primary/10 transition-colors">
                                    <Phone className="w-5 h-5 text-primary" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Contact</p>
                                    <p className="text-md font-bold text-foreground leading-tight">{user.contactNumber}</p>
                                </div>
                            </div>

                            {user.email && (
                                <div className="flex items-center gap-4 group">
                                    <div className="bg-primary/5 p-3 rounded-2xl ring-1 ring-primary/10 group-hover:bg-primary/10 transition-colors">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Email</p>
                                        <p className="text-md font-bold text-foreground leading-tight">{user.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="text-center pb-4 pt-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-full ring-1 ring-border">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                    Member since {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
