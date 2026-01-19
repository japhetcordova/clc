import SuggestionsClient from "./suggestions-client";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { trpcServer } from "@/lib/trpc/server";

export const dynamic = "force-dynamic";

export default async function SuggestionsPage() {
    // Get current user from cookie
    const cookieStore = await cookies();
    const qrCodeId = cookieStore.get("qrCodeId")?.value;

    if (!qrCodeId) {
        redirect("/registration");
    }

    const caller = await trpcServer();
    const user = await caller.getUserByQrId({ qrCodeId });

    if (!user) {
        redirect("/registration");
    }

    const suggestions = await caller.getSuggestions({ userId: user.id });

    return (
        <div className="min-h-screen bg-background">
            <SuggestionsClient
                initialSuggestions={suggestions as any}
                currentUser={user as any}
            />
        </div>
    );
}
