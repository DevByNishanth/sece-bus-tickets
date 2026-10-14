
import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import image from '../../assets/ctaBg.png'


const CTA = () => {
    return (
        <section className="px-4 mt-6">
            <div className="group relative mx-auto  overflow-hidden rounded-[24px] bg-[#e8f2ed] shadow-[0_20px_60px_-25px_rgba(16,40,38,0.22)] sm:rounded-[32px]">

                {/* Scenic background */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025]">
                    <img src={image} />
                </div>

                {/* Soft natural light behind the text */}
                <div
                    className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/40 to-black/50 "
                    aria-hidden="true"
                />

                {/* Bottom readability gradient */}
                <div
                    className="absolute inset-0 bg-gradient-to-t from-[#102d2b]/10 via-transparent to-white/10"
                    aria-hidden="true"
                />

                {/* Decorative botanical shapes */}
                <div
                    className="pointer-events-none absolute -left-12 -top-8 h-48 w-32 rotate-[-18deg] opacity-20"
                    aria-hidden="true"
                >
                    <svg viewBox="0 0 140 220" fill="none" className="h-full w-full text-[#0d6b68]">
                        <path
                            d="M5 220C45 168 75 104 110 5"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                        {[25, 60, 95, 130, 165].map((y, i) => (
                            <ellipse
                                key={y}
                                cx={i % 2 === 0 ? 48 : 76}
                                cy={y}
                                rx="13"
                                ry="28"
                                transform={`rotate(${i % 2 === 0 ? -45 : 45} ${i % 2 === 0 ? 48 : 76} ${y})`}
                                fill="currentColor"
                            />
                        ))}
                    </svg>
                </div>

                {/* Main content */}
                <div className="relative z-10 flex min-h-[330px] items-center px-7 py-10 sm:min-h-[350px] sm:px-10 md:px-14 lg:min-h-[390px] lg:px-16">
                    <div className="max-w-[470px]">

                        {/* Eyebrow */}
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0d6b68]/10 bg-white px-3 py-1.5 backdrop-blur-sm">
                            <Sparkles size={13} className="text-[#0d6b68]" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0d6b68] sm:text-[11px]">
                                Ready for your next trip?
                            </span>
                        </div>

                        {/* Heading */}
                        <h2 className="max-w-[430px] font-serif text-[34px] font-semibold leading-[1.08] tracking-[-0.045em] text-[#ffffff] sm:text-[42px] lg:text-[50px]">
                            Travel More.
                            <br />
                            <span className="text-[#ffffff]">
                                Worry Less.
                            </span>
                        </h2>

                        {/* Description */}
                        <p className="mt-4 max-w-[350px] text-sm leading-6 text-[#ffffff]/80 sm:text-[15px] sm:leading-7">
                            Book your next bus ticket today and discover
                            new places, new stories and better journeys
                            with Voyago.
                        </p>

                        {/* CTA button */}
                        <a
                            href="/booking"
                            className="group/button mt-6 inline-flex items-center gap-3 rounded-xl bg-[#0d6b68] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(13,107,104,0.65)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#095653] hover:shadow-[0_14px_26px_-10px_rgba(13,107,104,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d6b68] focus-visible:ring-offset-2"
                        >
                            Book Your Ticket
                            <ArrowRight
                                size={17}
                                className="transition-transform duration-300 group-hover/button:translate-x-1"
                            />
                        </a>

                        <p className="mt-4 text-[11px] font-medium tracking-wide text-[#ffffff]">
                            Your journey begins with a single click.
                        </p>
                    </div>
                </div>

                {/* Handwritten-style message on the right */}
                <div className="pointer-events-none absolute right-[5%] top-[12%] z-10 hidden -rotate-[8deg] text-center md:block">
                    <span className="block font-serif text-lg italic text-[#ffffff]/90 lg:text-xl">
                        New Roads,
                    </span>
                    <span className="block font-serif text-lg italic text-[#ffffff]/90 lg:text-xl">
                        New Stories
                    </span>
                    <span className="mt-1 block font-serif text-2xl font-semibold italic text-[#ffffff] lg:text-3xl">
                        Same You.
                    </span>
                    <svg
                        viewBox="0 0 100 22"
                        className="mx-auto mt-1 w-24 text-[#ffffff]"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M4 14C28 3 55 20 93 6M82 4L94 6L88 15"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

            </div>
        </section>
    );
};

export default CTA;
