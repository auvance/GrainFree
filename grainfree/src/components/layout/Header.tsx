'use client'

import Link from "next/link"
import Image from "next/image"
import React from "react"
import LeafIcon from "/public/LeafLogo.svg"

export default function Header() {
    

    return (
        <header className="flex | justify-between | items-center | mr-12 ml-12 pt-5 |">
            {/* Left nav links */}
            <nav className="flex | flex-row | gap-20 | pt-3 pb-3 pr-20 pl-20 | bg-transparent | text-[#4A4A4A] font-normal font-[AeonikArabic] | border-1 border-[#E6E6E6] | rounded-xl">
                <Link href="/system" className="">Get Started</Link>
                <Link href="/dash" className="">Dashboard</Link>
                <Link href="/grainhub" className="">GrainFreeHub</Link>
                <Link href="/about" className="">Learn More</Link>
                <Link href="/help" className="">Help Center</Link>
            </nav>


            {/* Right-side text + icon */}
            <div className="flex | flex-row | gap-10 | items-center |">
                <p className="text-black font-normal font-[AeonikArabic]">
                    You're <span className="font-semibold font-[AeonikArabic]">one</span> decision away<br/>
                    from <span className="text-[#1DA1C9] font-semibold font-[AeonikArabic]">changing your life.</span>
                </p>

                {/* Leaf Icon Hamburger Menu Toggle */}
                <Image src={LeafIcon} alt="LeafIcon" className="block w-20 h-auto"/>
            </div>

        </header>
    )
}