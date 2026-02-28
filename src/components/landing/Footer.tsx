'use client';

import { BRAND_NAME, BRAND_LOGO_LETTER } from '@/config/brand';

export default function Footer() {
    return (
        <footer className="bg-canvas border-t border-sub py-10 px-6 font-[family-name:var(--font-ui)] text-[12px] text-dim">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Left: Brand */}
                <div className="flex items-center">
                    <div className="w-[18px] h-[18px] bg-sage text-canvas font-bold text-[10px] flex items-center justify-center rounded-[3px] mr-2 opacity-90">
                        {BRAND_LOGO_LETTER}
                    </div>
                    <div className="font-[family-name:var(--font-display)] font-semibold text-[16px] text-ink opacity-90 translate-y-[1px]">
                        {BRAND_NAME}
                    </div>
                </div>

                {/* Center: Links */}
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 uppercase tracking-[0.1em]">
                    <a href="#" className="hover:text-ink transition-colors duration-200">Product</a>
                    <a href="#" className="hover:text-ink transition-colors duration-200">Pricing</a>
                    <a href="#" className="hover:text-ink transition-colors duration-200">Enterprise</a>
                    <a href="#" className="hover:text-ink transition-colors duration-200">Privacy</a>
                    <a href="#" className="hover:text-ink transition-colors duration-200">Terms</a>
                </div>

                {/* Right: Copyright */}
                <div className="tracking-wide">
                    &copy; {new Date().getFullYear()} {BRAND_NAME} Inc.
                </div>

            </div>
        </footer>
    );
}
