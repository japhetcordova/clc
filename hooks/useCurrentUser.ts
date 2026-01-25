
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { usePathname } from "next/navigation";

export function useCurrentUser() {
    const pathname = usePathname();
    const [urlQrCodeId, setUrlQrCodeId] = useState<string | null>(null);

    // 1. Get user from server-side cookie (handles httpOnly cookies)
    const { data: me, isLoading: meLoading } = trpc.getMe.useQuery();

    // 2. Fallback: Get QR code from URL (for profile pages)
    useEffect(() => {
        const urlMatch = pathname?.match(/\/profile\/([a-zA-Z0-9]+)/);
        const urlId = urlMatch?.[1];
        if (urlId) setUrlQrCodeId(urlId);
    }, [pathname]);

    // 3. Get user from URL QR ID if we don't have a session user
    const { data: urlUser, isLoading: urlUserLoading } = trpc.getUserByQrId.useQuery(
        { qrCodeId: urlQrCodeId || "" },
        { enabled: !!urlQrCodeId && !me }
    );

    const user = me || urlUser;
    const qrCodeId = me?.qrCodeId || urlQrCodeId;
    const isLoading = meLoading || (!!urlQrCodeId && !me && urlUserLoading);

    // Admin logic: 
    // Admin status should ONLY be active if there is a verified session (me)
    const isAdmin = !!me && (
        me.qrCodeId === "7af73c1cba10e8fa" || (
            me.firstName?.toLowerCase().includes("chloe") &&
            me.firstName?.toLowerCase().includes("japhet") &&
            me.lastName?.toLowerCase().includes("cordova")
        )
    );

    return { user, qrCodeId, isAdmin, isLoading };
}
