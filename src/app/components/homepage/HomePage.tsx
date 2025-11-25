"use client";

import Footer from "../layout/Footer";
import Feature from "./sections/Feature";
import Hero from "./sections/Hero";
import HpHowItWorks from "./sections/HowItWorks";
import HpTestimonials from "./sections/Testimonial";
import TokenInfo from "./sections/TokenInfo";
import FeaturedProjects from "./sections/FeaturedProjects";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a loader or null to prevent hydration mismatch
    return null;
  }

  return (
    <div className="bg-black text-white">
      <Hero />
      <main>
        <FeaturedProjects />
        <Feature />
        <HpHowItWorks />
        <HpTestimonials />
        <TokenInfo />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;