import { Navigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { AboutSection } from "@/components/landing/AboutSection";
import { AlfieSection } from "@/components/landing/AlfieSection";
import { Pricing } from "@/components/landing/Pricing";
import { FynkSection } from "@/components/landing/FynkSection";
import { SimulatorButton } from "@/components/landing/SimulatorButton";
import { AmbassadorSection } from "@/components/landing/AmbassadorSection";
import { AlfieChat } from "@/components/landing/AlfieChat";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import '@/utils/autoSetupPromos';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <AboutSection />
      <AlfieSection />
      <Pricing />
      <FynkSection />
      <SimulatorButton />
      <AmbassadorSection />
      <FAQ />
      <AlfieChat />
      <Footer />
    </div>
  );
};

export default Index;
