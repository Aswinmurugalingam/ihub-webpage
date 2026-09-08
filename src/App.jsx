import { useState, useEffect, Suspense, lazy, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SplashScreen from './components/ui/SplashScreen';
import PageLoader from './components/ui/PageLoader';
import SeoManager from './components/ui/SeoManager';
import { ProgressBar, WaFab } from './components/ui/Widgets';
import { MobileStickyBar } from './components/sections/Sections';

const Home           = lazy(() => import('./pages/Home'));
const Services       = lazy(() => import('./pages/Services'));
const Pricing        = lazy(() => import('./pages/Pricing'));
const About          = lazy(() => import('./pages/About'));
const Contact        = lazy(() => import('./pages/Contact'));
const PickupDelivery = lazy(() => import('./pages/PickupDelivery'));
const SellPhone      = lazy(() => import('./pages/SellPhone'));
const Policy         = lazy(() => import('./pages/Policy'));
const NotFound       = lazy(() => import('./pages/NotFound'));

const SPLASH_SESSION_KEY = 'ihub:splash-seen:v1';

function hasSeenSplashThisSession() {
  try {
    return window.sessionStorage.getItem(SPLASH_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function AnimatedRoutes() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const previousLocationKey = useRef(location.key);
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Keep the professional iHub loader visible briefly on every real page navigation.
    // This is intentionally short so it feels responsive and does not delay the route logic.
    if (location.key !== previousLocationKey.current) {
      previousLocationKey.current = location.key;
      setRouteLoading(true);
      const timer = window.setTimeout(() => setRouteLoading(false), reduceMotion ? 120 : 360);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [location.key, location.pathname, reduceMotion]);

  const pageVariants = reduceMotion
    ? { initial: { opacity: 1 }, enter: { opacity: 1 }, exit: { opacity: 1 } }
    : { initial: { opacity: 0, y: 10 }, enter: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 } };

  return <>
    <SeoManager />
    <AnimatePresence mode="wait">
      {routeLoading && <PageLoader key={`route-loader-${location.key}`} />}
    </AnimatePresence>
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        transition={{ duration: reduceMotion ? 0 : .24, ease: [.22, 1, .36, 1] }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<Navigate to="/services" replace />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<Navigate to="/pickup-delivery#book-repair" replace />} />
            <Route path="/pickup-delivery" element={<PickupDelivery />} />
            <Route path="/sell-phone" element={<SellPhone />} />
            <Route path="/privacy" element={<Policy />} />
            <Route path="/repair-policy" element={<Policy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  </>;
}

function SiteShell() {
  return <>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <ProgressBar />
    <Navbar />
    <main id="main-content" tabIndex="-1" style={{ paddingTop: 'var(--nav-h)' }}><AnimatedRoutes /></main>
    <Footer />
    <WaFab />
    <MobileStickyBar />
  </>;
}

export default function App() {
  const [splashDone, setSplashDone] = useState(hasSeenSplashThisSession);
  const handleSplashDone = useCallback(() => {
    try { window.sessionStorage.setItem(SPLASH_SESSION_KEY, '1'); } catch { /* session storage is optional */ }
    setSplashDone(true);
  }, []);

  return <MotionConfig reducedMotion="user">
    {/* The site mounts immediately so lazy chunks and hero assets load behind the short first-visit splash. */}
    <BrowserRouter><SiteShell /></BrowserRouter>
    <AnimatePresence>{!splashDone && <SplashScreen key="splash" onDone={handleSplashDone} />}</AnimatePresence>
  </MotionConfig>;
}
