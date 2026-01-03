"use client";

import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import DigitalIDCard from "@/components/DigitalIDCard";

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

export default function ProfileClient({ user, qrValue }: ProfileClientProps) {
    const profileUrl = typeof window !== "undefined" ? `${window.location.origin}/profile/${qrValue}` : "";

    const downloadPDF = async () => {
        const element = document.getElementById("digital-id-card");
        if (!element) return;

        toast.loading("Generating your Digital ID...", { id: "pdf-gen-profile" });

        try {
            const dataUrl = await toPng(element, {
                quality: 1.0,
                pixelRatio: 3,
                backgroundColor: '#ffffff'
            });

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: [400, 600]
            });

            pdf.addImage(dataUrl, "PNG", 0, 0, 400, 600, undefined, "FAST");
            pdf.save(`CLC-ID-${user.firstName}-${user.lastName}.pdf`);

            toast.success("Digital ID Ready!", { id: "pdf-gen-profile" });
        } catch (err) {
            toast.error("Failed to generate PDF.", { id: "pdf-gen-profile" });
        }
    };

    return (
        <>
            <div className="flex flex-col items-center gap-6">
                <div className="p-3 bg-white rounded-xl shadow-inner shadow-black/5">
                    <QRCodeSVG
                        value={profileUrl || qrValue}
                        size={160}
                        level="H"
                        includeMargin
                    />
                </div>

                <Button
                    variant="outline"
                    onClick={downloadPDF}
                    className="w-full max-w-[200px] border-2 border-primary/10 hover:bg-primary/5 rounded-xl font-bold flex items-center justify-center gap-2 h-11"
                >
                    <FileDown className="w-5 h-5" />
                    Download ID
                </Button>
            </div>

            {/* Hidden component for PDF generation */}
            <div className="fixed -left-[2000px] top-0 pointer-events-none">
                <DigitalIDCard user={user} qrValue={profileUrl} />
            </div>
        </>
    );
}
