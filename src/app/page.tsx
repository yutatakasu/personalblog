import { unstable_noStore as noStore } from "next/cache";

import { Header } from "@/components/Header";
import { ScrollToAtlas } from "@/components/ScrollToAtlas";
import { getInvestorGroups } from "@/models/backed_by";
import { getNewsItems } from "@/models/news";
import { getPositions } from "@/models/positions";
import { getTeamMembers } from "@/models/team";
import { AboutSection } from "@/sections/AboutSection";
import { AtlasHero } from "@/sections/AtlasHero";
import { CareersSection } from "@/sections/CareersSection";
import { ContactSection } from "@/sections/ContactSection";
import { ProductsSection } from "@/sections/ProductsSection";

export default async function Home() {
  noStore();
  const [newsItems, teamMembers, investorGroups, positions] =
    await Promise.all([
      getNewsItems(),
      getTeamMembers(),
      getInvestorGroups(),
      getPositions(),
    ]);

  return (
    <div className="min-h-screen">
      <ScrollToAtlas />
      <Header />
      <main className="h-screen h-dvh overflow-y-scroll overscroll-y-contain snap-y snap-mandatory scroll-smooth">
        <AtlasHero />
        <ProductsSection />
        <AboutSection
          newsItems={newsItems}
          teamMembers={teamMembers}
          investorGroups={investorGroups}
        />
        <CareersSection positions={positions} />
        <ContactSection />
      </main>
    </div>
  );
}
