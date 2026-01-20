"use client";

import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer";

import GrainFreeWordmark from "../components/layout/Home/GrainFreeWordmark";
import CeliacPhases from "../components/layout/Home/CeliacPhases";
import FeatureBento from "../components/layout/Home/FeatureBento";

export default function HomePage() {
  return (
    <main className="bg-[#FAFAF5] rounded-xl">
      <Header />
      <GrainFreeWordmark />
      <CeliacPhases />
      <FeatureBento />
      <Footer />
    </main>
  );
}
