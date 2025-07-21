'use client'

import Link from "next/link"
import Image from "next/image"
import React from "react"
import LeafIcon from "/public/LeafLogo.svg"

export default function Header() {
    

    return (
        <header>
            {/* Left nav links */}
            <nav>
                <Link href="/system" className="">Get Started</Link>
                <Link href="/dash" className="">Dashboard</Link>
                <Link href="/grainhub" className="">GrainFreeHub</Link>
                <Link href="/about" className="">Learn More</Link>
                <Link href="/help" className="">Help Center</Link>
            </nav>


            {/* Right-side text + icon */}
            <div className="">
                <p>
                    You're <span className="">one</span> decision away<br/>
                    from <span className="">changing your life.</span>
                </p>

                {/* Leaf Icon Hamburger Menu Toggle */}
                <Image src={LeafIcon} alt="LeafIcon" className=""/>
            </div>

        </header>
    )
}