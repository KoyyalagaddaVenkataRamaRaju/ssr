import React, { useEffect, useState } from "react";
import AboutSection from "../components/AboutSection";
import HighlightsSection from "../components/HighlightsSection";
import DepartmentsShowcase from "../components/DepartmentsShowcase";
import FacilitiesSection from "../components/FacilitiesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import PrincipalMessage from "../components/PrincipalMessage";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import HomeWelcomeSection from "../components/HomeWelcomeSection";
import NewsScroller from "../components/NewsScroller";
import ManagementSection from "../components/ManagementSection";
import StatsCounter from "../components/StatsCounter";
import StudentsJourney from "../components/StudentsJourney";

const API = import.meta.env.VITE_API_URL;

const HomePage = () => {
  const [slides, setSlides] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingHero, setLoadingHero] = useState(true);
  const [loadingDepts, setLoadingDepts] = useState(true);

  useEffect(() => {
    const load = async () => {
      const resSlides = await fetch(`${API}/api/hero-carousel/slides`);
      const dataSlides = await resSlides.json();
      setSlides(dataSlides.data || []);
      setTimeout(() => setLoadingHero(false), 1000);

      const resDept = await fetch(`${API}/api/departments`);
      const dataDept = await resDept.json();
      setDepartments(dataDept.data || []);
      setTimeout(() => setLoadingDepts(false), 1000);
    };

    load();
  }, []);

  return (
    <>
    <Navbar/>
      {/* HERO SECTION */}
      {loadingHero ? (
        <div className="container py-5">
          <div className="skeleton" style={{ height: 320 }} />
        </div>
      ) : (
        <HeroSection slides={slides} />
      )}
      <NewsScroller/>
      <HomeWelcomeSection/>
      <ManagementSection/>
      <StatsCounter/>
      <StudentsJourney/>


      <Footer />

      <style>{`
        .skeleton {
          background: linear-gradient(90deg,#ececec,#f7f7f7,#ececec);
          background-size: 200% 100%;
          animation: shimmer 1.2s infinite;
          border-radius: 12px;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </>
  );
};

export default HomePage;
