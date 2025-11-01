import { Header } from "@/components/Header";
import { ScrollToAtlas } from "@/components/ScrollToAtlas";
import { AboutSection } from "@/sections/AboutSection";
import { AtlasHero } from "@/sections/AtlasHero";
import { CareersSection } from "@/sections/CareersSection";
import { ContactSection } from "@/sections/ContactSection";
import { ProductsSection } from "@/sections/ProductsSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <ScrollToAtlas />
      <Header />
      <main className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
        <AtlasHero />
        <ProductsSection />
        <AboutSection />
        <CareersSection />
        <ContactSection />
      </main>
    </div>
  );
}
