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
import PremiumCursor from '@/components/PremiumCursor';
import BrandVideoSection from '@/components/BrandVideoSection';
import ChocolateMascot from '@/components/ChocolateMascot';
import CheckoutModal from '@/components/CheckoutModal';
import CEOVideoSection from '@/components/CEOVideoSection';

function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <ShopProvider>
      <PremiumCursor />

      {!introDone && <IntroLoader onComplete={() => setIntroDone(true)} />}

      <div className="relative min-h-screen bg-cream-100">
        <Navbar />
        <main>
          <Hero />
          <WhyMoggy />
          <BrandVideoSection />
          <Collection />
          <SugarFree />
          <GiftBasket />
          <FeaturedSlider />
          <Testimonials />
          <CEOVideoSection />
          <About />
          <Contact />
        </main>
        <Footer />

        {/* Overlays */}
        <CartDrawer />
        <WishlistDrawer />
        <SearchOverlay />
        <MoggyChat />
        <CheckoutModal />
        <ChocolateMascot />
      </div>
    </ShopProvider>
     );
}
    const sendToGemini = async (userMessage: string) => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }]
      }),
    }
  );

  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}
}

export default App;
