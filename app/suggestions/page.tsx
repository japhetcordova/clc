import { getSuggestions } from "@/lib/actions";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import SuggestionsClient from "./suggestions-client";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function SuggestionsPage() {
    // Get current user from cookie
    const cookieStore = await cookies();
    const qrCodeId = cookieStore.get("qrCodeId")?.value;

    if (!qrCodeId) {
        redirect("/registration");
    }

    const [user] = await db.select().from(users).where(eq(users.qrCodeId, qrCodeId)).limit(1);

    if (!user) {
        redirect("/registration");
    }

    const suggestionsResult = await getSuggestions(user.id);

    return (
        <div className="min-h-screen bg-background">
            <SuggestionsClient
                initialSuggestions={suggestionsResult.suggestions || []}
                currentUser={user}
            />
        </div>
    );
}
