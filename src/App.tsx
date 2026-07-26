import { useState } from 'react';
import { ShopProvider } from '@/context/ShopContext';
import IntroLoader from '@/components/IntroLoader';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import WhyMoggy from '@/components/WhyMoggy';
import Collection from '@/components/Collection';
import SugarFree from '@/components/SugarFree';
import GiftBasket from '@/components/GiftBasket';
import FeaturedSlider from '@/components/FeaturedSlider';
import Testimonials from '@/components/Testimonials';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import WishlistDrawer from '@/components/WishlistDrawer';
import SearchOverlay from '@/components/SearchOverlay';
import MoggyChat from '@/components/MoggyChat';

function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <ShopProvider>
      {!introDone && <IntroLoader onComplete={() => setIntroDone(true)} />}

      <div className="relative min-h-screen bg-cream-100">
        <Navbar />
        <main>
          <Hero />
          <WhyMoggy />
          <Collection />
          <SugarFree />
          <GiftBasket />
          <FeaturedSlider />
          <Testimonials />
          <About />
          <Contact />
        </main>
        <Footer />

        {/* Overlays */}
        <CartDrawer />
        <WishlistDrawer />
        <SearchOverlay />
        <MoggyChat />
      </div>
    </ShopProvider>
  );
}

export default App;
