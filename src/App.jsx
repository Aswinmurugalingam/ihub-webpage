import { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SplashScreen from './components/ui/SplashScreen';
import PageLoader from './components/ui/PageLoader';
import SeoManager from './components/ui/SeoManager';
import { ProgressBar, WaFab } from './components/ui/Widgets';
import { MobileStickyBar } from './components/sections/Sections';

const Home          = lazy(() => import('./pages/Home'));
const Services      = lazy(() => import('./pages/Services'));
const Pricing       = lazy(() => import('./pages/Pricing'));
const About         = lazy(() => import('./pages/About'));
const Contact       = lazy(() => import('./pages/Contact'));
const Booking       = lazy(() => import('./pages/Booking'));
const PickupDelivery= lazy(() => import('./pages/PickupDelivery'));
const Policy        = lazy(() => import('./pages/Policy'));
const NotFound      = lazy(() => import('./pages/NotFound'));

const pageVariants = { initial:{opacity:0,y:18}, enter:{opacity:1,y:0}, exit:{opacity:0,y:-10} };

function AnimatedRoutes() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [prevKey, setPrevKey] = useState(location.key);

  useEffect(() => {
    if (location.key !== prevKey) {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: 'instant' });
      const t = setTimeout(() => { setLoading(false); setPrevKey(location.key); }, 360);
      return () => clearTimeout(t);
    }
  }, [location.key, prevKey]);

  return <>
    <SeoManager />
    <AnimatePresence mode="wait">{loading && <PageLoader key="loader" />}</AnimatePresence>
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="enter" exit="exit" transition={{duration:.42,ease:[.22,1,.36,1]}}>
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<Navigate to="/services" replace />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/pickup-delivery" element={<PickupDelivery />} />
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
    <ProgressBar/>
    <Navbar/>
    <main style={{paddingTop:'var(--nav-h)'}}><AnimatedRoutes/></main>
    <Footer/>
    <WaFab/>
    <MobileStickyBar/>
  </>;
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  return <>
    {/* Mount the site immediately behind the splash so lazy page chunks and
        hero assets can load while the opening animation is still visible. */}
    <BrowserRouter><SiteShell/></BrowserRouter>
    <AnimatePresence>{!splashDone && <SplashScreen key="splash" onDone={handleSplashDone}/>}</AnimatePresence>
  </>;
}
