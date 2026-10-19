import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation, Link } from 'react-router-dom';
import { MotionConfig, motion } from 'framer-motion';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import MobileActionBar from './components/layout/MobileActionBar.jsx';
import FloatingContact from './components/layout/FloatingContact.jsx';
import ScrollManager from './components/layout/ScrollManager.jsx';
import Home from './pages/Home.jsx';

const Book = lazy(() => import('./pages/Book.jsx'));
const Confirmation = lazy(() => import('./pages/Confirmation.jsx'));
const Fleet = lazy(() => import('./pages/Fleet.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const AirportsIndex = lazy(() => import('./pages/Airports.jsx').then((m) => ({ default: m.AirportsIndex })));
const AirportDetail = lazy(() => import('./pages/Airports.jsx').then((m) => ({ default: m.AirportDetail })));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Terms = lazy(() => import('./pages/Terms.jsx'));

function NotFound() {
  return (
    <div className="grid min-h-[80vh] place-items-center px-5 pt-24 text-center">
      <div>
        <p className="font-display text-[96px] font-bold leading-none text-gold-gradient">404</p>
        <h1 className="mt-2 font-display text-[28px] text-white">This road doesn’t exist</h1>
        <p className="mt-2 text-sand">Let us take you somewhere better.</p>
        <Link to="/" className="btn-gold mt-6">Back to home</Link>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  return (
    <MotionConfig reducedMotion="user">
      <ScrollManager />
      <Header />
      <motion.main key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <Suspense fallback={<div className="min-h-screen bg-ink-850" />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<Book />} />
            <Route path="/booking/:ref" element={<Confirmation />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/services" element={<Services />} />
            <Route path="/airports" element={<AirportsIndex />} />
            <Route path="/airports/:slug" element={<AirportDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.main>
      {!location.pathname.startsWith('/book') && <Footer />}
      <MobileActionBar />
      <FloatingContact />
    </MotionConfig>
  );
}
