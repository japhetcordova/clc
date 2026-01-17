"use client";

import { motion } from "framer-motion";
import { Users, Award, History } from "lucide-react";
import Image from "next/image";

interface AboutStoryProps {
    fadeIn: any;
}

export function AboutStory({ fadeIn }: AboutStoryProps) {
    return (
        <section className="py-12 md:py-20 px-4 md:px-8 relative bg-muted/20">
            <div className="max-w-[1920px] mx-auto grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
                <motion.div {...fadeIn} className="space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black uppercase italic tracking-tight">How It <span className="text-primary">All Started</span></h2>
                        <div className="space-y-4 text-muted-foreground font-medium leading-relaxed">
                            <p className="text-foreground italic font-black text-lg">
                                &quot;What started out as a small gathering have grown into a great congregation, and it was all made possible by the God of possibilities.&quot;
                            </p>
                            <p>
                                Our Senior Pastors Jeser and Arlene Molina started forming cell groups in June 2012. They endured travelling from Davao to Tagum on weekdays to shepherd small groups. The calling God put in their hearts made them to do so and set their vision to make Jesus win. They started winning souls in campus, company and community. With the help of several church leaders in Tagum, they have established cell groups in campuses.
                            </p>
                            <p>
                                The very first Sunday Service of CLC Tagum happened last February 2013 attended by 52 persons only. Moving from one place to another, the church finally settled in the big HUB last July 19, 2019. Today, CLC Tagum has a population of about 1000 cell members and a total of 122 cell groups.
                            </p>
                            <p>
                                The world halted for a while because of COVID-19 but cell groups strengthened our leaders. Since people could not go to church, the church went to them instead. With the 122 passionate leaders who are willing to be uncomfortable to comfort others, cell groups continued to flourish. Our biggest breakthrough happened with the launching of our online services, helping us to be unstoppable.
                            </p>
                            <p>
                                CLC Tagum has established outreaches in Mati, Dujali, Asuncion, Pagsabangan, Sto. Tomas and several community outreaches in Barangays of Tagum City. In CLC, we seek to be one church in many locations, passionate to God and compassionate to people, envisioning to be a church that adds value to others.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Users className="w-6 h-6 text-primary" />
                            <h3 className="font-black uppercase text-xs tracking-widest">Growing Family</h3>
                            <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">1000+ members and 122 cell groups.</p>
                        </div>
                        <div className="space-y-2">
                            <Award className="w-6 h-6 text-amber-500" />
                            <h3 className="font-black uppercase text-xs tracking-widest">Historic Move</h3>
                            <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">Settled in the Big HUB on July 19, 2019.</p>
                        </div>
                    </div>
                </motion.div>
                <motion.div {...fadeIn} className="relative">
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                        <div className="aspect-square rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-border relative">
                            <Image
                                src="/about/about1.webp"
                                alt="Church History 1"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        <div className="aspect-square rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-border relative md:translate-y-12">
                            <Image
                                src="/about/about2.webp"
                                alt="Church History 2"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        <div className="aspect-square rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-border relative md:-translate-y-12">
                            <Image
                                src="/about/about3.webp"
                                alt="Church History 3"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        <div className="aspect-square rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-border relative">
                            <Image
                                src="/about/about4.webp"
                                alt="Church History 4"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 p-8 rounded-[2rem] bg-primary text-white shadow-2xl max-w-[200px] hidden xl:block z-10">
                        <History className="w-8 h-8 mb-3" />
                        <h4 className="font-black text-xl italic uppercase tracking-tighter">Feb 2013</h4>
                        <p className="text-[10px] font-bold opacity-80 uppercase mt-1">First Sunday Service of CLC Tagum.</p>
                    </div>
                </motion.div>
            </div>
            {/* SMOOTH TRANSITION TO LEADERSHIP */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-b from-transparent to-background z-0 pointer-events-none" />
        </section>
    );
}
