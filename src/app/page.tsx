import { Header } from "@/components/Header";
import { ScrollToAtlas } from "@/components/ScrollToAtlas";
import { getInvestorGroups } from "@/models/backed_by";
import { getNewsItems } from "@/models/news";
import { getTeamMembers } from "@/models/team";
import { AboutSection } from "@/sections/AboutSection";
import { AtlasHero } from "@/sections/AtlasHero";
import { CareersSection } from "@/sections/CareersSection";
import { ContactSection } from "@/sections/ContactSection";
import { ProductsSection } from "@/sections/ProductsSection";

export default async function Home() {
  const [newsItems, teamMembers, investorGroups] = await Promise.all([
    getNewsItems(),
    getTeamMembers(),
    getInvestorGroups(),
  ]);

  return (
    <div className="min-h-screen">
      <ScrollToAtlas />
      <Header />
      <main className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
        <AtlasHero />
        <ProductsSection />
        <AboutSection
          newsItems={newsItems}
          teamMembers={teamMembers}
          investorGroups={investorGroups}
        />
        <CareersSection />
        <ContactSection />
      </main>
    </div>
  );
}
