import { AboutHero } from "@/components/about/AboutHero";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutPastors } from "@/components/about/AboutPastors";
import { AboutG12 } from "@/components/about/AboutG12";
import { AboutBeliefs } from "@/components/about/AboutBeliefs";
import { AboutQuote } from "@/components/about/AboutQuote";
import { AboutCTA } from "@/components/about/AboutCTA";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn more about Christian Life Center Tagum City, our story, our pastors, and our mission to love God and people.",
};

export default function AboutPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
            <AboutHero fadeIn={fadeIn} />
            <AboutStory fadeIn={fadeIn} />
            <AboutPastors fadeIn={fadeIn} />
            <AboutG12 fadeIn={fadeIn} />
            <AboutBeliefs fadeIn={fadeIn} />
            <AboutQuote fadeIn={fadeIn} />
            <AboutCTA />
        </div>
    );
}

