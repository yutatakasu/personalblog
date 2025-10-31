import { Header } from "@/components/Header";
import { ScrollToAtlas } from "@/components/ScrollToAtlas";
import { AtlasHero } from "@/sections/AtlasHero";
import { ProductsSection } from "@/sections/ProductsSection";
import { AboutSection } from "@/sections/AboutSection";
import { CareersSection } from "@/sections/CareersSection";
import { ContactSection } from "@/sections/ContactSection";

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
