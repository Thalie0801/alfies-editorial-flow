import { Navigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { AlfieSection } from "@/components/landing/AlfieSection";
import { Pricing } from "@/components/landing/Pricing";
import { FynkSection } from "@/components/landing/FynkSection";
import { SimulatorButton } from "@/components/landing/SimulatorButton";
import { AmbassadorSection } from "@/components/landing/AmbassadorSection";
import { StickyBar } from "@/components/landing/StickyBar";
import { AlfieChat } from "@/components/landing/AlfieChat";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <AlfieSection />
      <Pricing />
      <FynkSection />
      <SimulatorButton />
      <AmbassadorSection />
      <StickyBar />
      <AlfieChat />
    </div>
  );
};

export default Index;
