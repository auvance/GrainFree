
import Link from "next/link"
import Image from "next/image"
import React from "react"


export default function Footer() {


    return (
        <footer className="bg-[#1B251E] p-10 pt-25">

            {/* Top Message */}
            <section className="flex flex-col items-center">
                <div className="text-2xl text-white font-bold italic font-[AeonikArabic]">
                    <p>Built for the ones figuring it out.</p>
                    <p>Not for project — for progress.</p>
                </div>
                
                {/* Main Logo */}
                <div className="text-[#3D4F46] text-center mb-8">
                    <h2 className="text-9xl font-bold font-[AeonikArabic]">
                        Grain<span className="text-[#008509]">Free</span>
                    </h2>
                </div>
            </section>

            {/* Divider */}
            <hr className="border-t border-gray-700 mb-8 mx-auto w-11/12" />

            {/* Nav List Items */}
            
            <section className="flex flex-col gap-30 mb-8 mx-auto w-11/12">
                <div className="text-[#658273] grid grid-cols-2 gap-5 font-normal font-[AeonikArabic]">
                    <Link href="/system" className="" prefetch>Get Started</Link>
                    <Link href="/dash" className="" prefetch>Privacy Policy</Link>
                    <Link href="/grainhub" className="" prefetch>Donate ❥</Link>
                    <Link href="/about" className="" prefetch>Terms & Conditions</Link>
                    <Link href="/help" className="" prefetch>Github</Link>
                    <Link href="/help" className="" prefetch>Help Center</Link>
                </div>

                <p className="text-[#658273] font-normal font-[AeonikArabic]">@GrainFree 2025. All Rights Reserved</p>
            </section>
            
        </footer>
    )

}