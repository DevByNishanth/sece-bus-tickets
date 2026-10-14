
import React from 'react';
import {
    BusFront,
    MapPin,
    Phone,
    Mail,
    Headset,
    ShieldCheck,
    ArrowUpRight,
} from 'lucide-react';

import logo from '../../assets/logo.svg'; // Adjust path to your logo

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {
            title: 'TRAVEL WITH US',
            links: [
                { label: 'Search Buses', href: '/buses' },
                { label: 'Popular Routes', href: '/routes' },
                { label: 'Bus Operators', href: '/operators' },
                { label: 'Manage Booking', href: '/my-bookings' },
            ],
        },
        {
            title: 'COMPANY',
            links: [
                { label: 'About BusGo', href: '/about' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Careers', href: '/careers' },
                { label: 'Partner With Us', href: '/partners' },
            ],
        },
        {
            title: 'SUPPORT & LEGAL',
            links: [
                { label: 'Help Center', href: '/help' },
                { label: 'Cancellation Policy', href: '/cancellation-policy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Privacy Policy', href: '/privacy' },
            ],
        },
    ];

    return (
        <footer className="bg-linear-to-r mt-16 from-[#091022] to-[#0a173a] text-slate-300">
            <div className="px-15 py-10">

                {/* Main Footer */}
                <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr] lg:gap-12">

                    {/* Brand */}
                    <div>
                        <a href="/" className="inline-flex items-center gap-2">
                            <img
                                src={logo}
                                alt="BusGo"
                                className="h-8 w-auto object-contain"
                            />
                        </a>

                        <p className="mt-4 max-w-xs text- leading-6 text-white">
                            Your journey, made simpler. Discover routes, find comfortable
                            buses, and book your next trip with BusGo.
                        </p>

                        <div className="mt-4 flex flex-col gap-3">
                            <a
                                href="/routes"
                                className="inline-flex items-center gap-2 text- text-slate-300 transition hover:text-teal-400"
                            >
                                <MapPin size={16} className="text-teal-400" />
                                Explore destinations
                                <ArrowUpRight size={12} />
                            </a>
                        </div>
                    </div>

                    {/* Footer Link Groups */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-[14px] font-bold tracking-[0.12em] text-white">
                                {section.title}
                            </h3>

                            <ul className="mt-4 space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-slate-400 transition hover:text-teal-400"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="mt-9 flex flex-col gap-4 border-t border-white/5 pt-5 sm:flex-row sm:items-center  sm:justify-between">

                    <div className="flex items-center gap-2 text-[15px] text-slate-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Making every journey easier with BusGo
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck size={14} />
                            Secure Booking
                        </span>

                        <a
                            href="/contact"
                            className="flex items-center gap-1.5 transition hover:text-teal-400"
                        >
                            <Headset size={14} />
                            Customer Support
                        </a>
                    </div>

                    <p className="text-[12px] text-slate-500">
                        © {currentYear} BusGo. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
