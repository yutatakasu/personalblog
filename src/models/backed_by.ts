export type InvestorGroup = {
  category: string;
  supporters: string[];
};

export const investorGroups: InvestorGroup[] = [
  {
    category: "Lead Investors",
    supporters: [
      "North Star Ventures",
      "FutureFabric Capital",
      "Tokyo Frontier Fund",
    ],
  },
  {
    category: "Strategic Angels",
    supporters: [
      "Ayumi Tanaka (ex-DeepMind)",
      "Ken Carter (ex-Snowflake)",
      "Yui Nakamura (LayerX)",
    ],
  },
  {
    category: "Enterprise Partners",
    supporters: ["Mitsuba Holdings", "Pacific Systems", "Global Insight Group"],
  },
];
