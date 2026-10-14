
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { ArrowRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import hero1 from '../../assets/h1.png';
import hero2 from '../../assets/h2.png';
import hero3 from '../../assets/h3.png';
import hero4 from '../../assets/h4.png';
import hero5 from '../../assets/h5.png';

import HeroSearchForm from '../../components/HeroSearchForm';

const slides = [
    {
        image: hero1,
        eyebrow: 'YOUR JOURNEY, YOUR STORY',
        title: 'Find Your Bus For The Season',
        description:
            'From scenic mountain escapes to weekend getaways, discover comfortable bus journeys and explore destinations worth travelling for.',
    },
    {
        image: hero4,
        eyebrow: 'MAKE EVERY MOMENT COUNT',
        title: 'Your Next Adventure Starts Here',
        description:
            'Discover breathtaking destinations, plan your perfect getaway, and enjoy a seamless travel experience from departure to arrival.',
    },
    {
        image: hero5,
        eyebrow: 'TRAVEL BEYOND EXPECTATIONS',
        title: 'Every Journey Has A Story',
        description:
            'Turn long-distance travel into a memorable experience with convenient bookings, comfortable rides, and beautiful routes along the way.',
    },
    {
        image: hero2,
        eyebrow: 'THE SMARTER WAY TO TRAVEL',
        title: 'Travel More, Worry Less',
        description:
            'Find the right bus for your journey with easy trip planning, reliable travel options, and a simpler way to reach the places you love.',
    },
    {
        image: hero3,
        eyebrow: 'YOUR NEXT DESTINATION AWAITS',
        title: 'Explore Beyond The Ordinary',
        description:
            'Whether it is a spontaneous weekend trip or a long-awaited holiday, your next destination is just a booking away.',
    },
];

const Hero = () => {
    return (
        <section className="px-3 pt-3 sm:px-5">
            <div
                className="hero-shell relative mx-auto h-[82svh] min-h-[590px] max-h-[900px] max-w-[1400px] overflow-hidden rounded-2xl bg-[#10182B] sm:h-[88svh] sm:rounded-3xl"
            >
                {/* Cinematic background slider */}
                <Swiper
                    modules={[Autoplay, EffectFade, Pagination]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    autoplay={{
                        delay: 1000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    pagination={{
                        clickable: true,
                        el: '.hero-pagination',
                    }}
                    loop
                    speed={1400}
                    watchSlidesProgress
                    className="hero-swiper absolute inset-0 h-full w-full"
                >
                    {slides.map((slide) => (
                        <SwiperSlide key={slide.title}>
                            <div className="hero-slide relative h-full w-full">
                                <img
                                    src={slide.image}
                                    alt=""
                                    aria-hidden="true"
                                    className="hero-image absolute inset-0 h-full w-full object-cover"
                                />

                                {/* Subtle cinematic contrast, not a heavy dark tint */}
                                <div className="hero-overlay absolute inset-0 bg-black/50" />

                                {/* Decorative teal light */}
                                <div
                                    className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-teal-500/10 blur-[100px]"
                                    aria-hidden="true"
                                />

                                {/* Animated slide content */}
                                <div className="hero-copy absolute inset-x-5 top-[17%] z-10 mx-auto max-w-4xl text-center text-white sm:top-[17%] lg:top-[15%]">
                                    <div className="hero-eyebrow mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[10px] font-semibold tracking-[0.22em] text-white backdrop-blur-md sm:text-xs">
                                        <span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_12px_rgba(94,234,212,0.9)]" />
                                        {slide.eyebrow}
                                    </div>

                                    <h1 className="hero-title mx-auto max-w-4xl text-3xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-[64px]">
                                        {slide.title}
                                    </h1>

                                    <p className="hero-description mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/90 sm:mt-6 sm:text-base lg:text-lg lg:leading-8">
                                        {slide.description}
                                    </p>

                                    <div className="hero-cta mt-6 flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                document
                                                    .getElementById('hero-search')
                                                    ?.scrollIntoView({
                                                        behavior: 'smooth',
                                                        block: 'center',
                                                    });
                                            }}
                                            className="group inline-flex items-center gap-2 rounded-full bg-[#0D6B68] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-950/20 transition duration-300 hover:-translate-y-1 hover:bg-[#0b7975] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#10182B]"
                                        >
                                            Start your journey
                                            <ArrowRight
                                                size={16}
                                                className="transition-transform duration-300 group-hover:translate-x-1"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Fixed search form */}
                <div
                    id="hero-search"
                    className="hero-search absolute inset-x-3 bottom-5 z-20 sm:inset-x-5 sm:bottom-8 lg:inset-x-8"
                >
                    <HeroSearchForm />
                </div>
            </div>

        </section>
    );
};

export default Hero;
