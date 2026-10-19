import Hero from '../components/home/Hero.jsx';
import StatsBand from '../components/home/StatsBand.jsx';
import AirportStatus from '../components/home/AirportStatus.jsx';
import FleetShowcase from '../components/home/FleetShowcase.jsx';
import HowItWorks from '../components/home/HowItWorks.jsx';
import CoverageMap from '../components/home/CoverageMap.jsx';
import AirportFares from '../components/home/AirportFares.jsx';
import PopularRoutes from '../components/home/PopularRoutes.jsx';
import ServicesGrid from '../components/home/ServicesGrid.jsx';
import WhyUs from '../components/home/WhyUs.jsx';
import Reviews from '../components/home/Reviews.jsx';
import PaymentBand from '../components/home/PaymentBand.jsx';
import FAQ from '../components/home/FAQ.jsx';
import FinalCTA from '../components/home/FinalCTA.jsx';
import usePageMeta from '../lib/usePageMeta.js';

export default function Home() {
  usePageMeta();
  return (
    <>
      <Hero />
      <StatsBand />
      <AirportStatus />
      <FleetShowcase />
      <HowItWorks />
      <AirportFares />
      <CoverageMap />
      <PopularRoutes />
      <ServicesGrid />
      <WhyUs />
      <Reviews />
      <PaymentBand />
      <FAQ />
      <FinalCTA />
    </>
  );
}
