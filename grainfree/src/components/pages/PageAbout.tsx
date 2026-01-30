import Header from "../layout/Header/Header";
import Footer from "../layout/Footer";

import AboutHero from "@/components/layout/About/AboutHero";
import SplitSection from "@/components/layout/About/AboutStorySplit";
import AboutPurpose from "@/components/layout/About/AboutPurpose"

export default function PageAbout() {
  return (
    <main className="min-h-screen bg-[#BFDFC7] rounded-xl">
      <Header />
      <AboutHero />
      <SplitSection />
      <AboutPurpose />
      <Footer />
    </main>
  );
}
