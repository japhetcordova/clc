import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MyQRPage() {
    const cookieStore = await cookies();
    const qrCodeId = cookieStore.get("qrCodeId")?.value;

    if (qrCodeId) {
        redirect(`/profile/${qrCodeId}`);
    } else {
        redirect("/registration?tab=login");
    }
}
