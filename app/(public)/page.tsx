import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function Home() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  if (isMobile) {
    redirect("/mobile");
  } else {
    // For desktop, redirect to the main landing page instead of the registration page
    redirect("/landing");
  }
}