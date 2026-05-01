import { useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BottomCTA } from "@/components/layout/BottomCTA";
import { HeroBanner } from "@/components/home/HeroBanner";
import { MarqueeBar } from "@/components/home/MarqueeBar";
import { CategoryNav } from "@/components/home/CategoryNav";
import { GameGrid } from "@/components/home/GameGrid";
import { InfoTable } from "@/components/home/InfoTable";

const Index = () => {
  const [cat, setCat] = useState("cricket");

  return (
    <div className="min-h-screen bg-background pb-20">
      <SiteHeader />
      <HeroBanner />
      <MarqueeBar text="Bangladesh's most trusted online casino & cricket exchange 2026. Enjoy variety live casino games, BPL, ICC (One Day International). Join Rex9 today!" />
      <CategoryNav active={cat} onChange={setCat} />
      <GameGrid category={cat} />
      <InfoTable />

      <section className="px-4 py-6 max-w-3xl mx-auto">
        <h1 className="text-xl font-bold text-foreground mb-3">Rex9 | Trusted Online Casino And Sports Betting App In Bangladesh To Play & Win</h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Welcome to Rex9 Online Casino — your ultimate destination for premium online gaming.
          Whether you are a casual gamer or a seasoned pro, Rex9 offers a variety of games,
          promotions, and a seamless gaming experience to cater to all types of players.
          Our platform is designed with user-friendliness in mind, allowing you to immerse
          yourself in high-quality entertainment right from the comfort of your home.
        </p>
        <h2 className="text-lg font-bold text-foreground mt-4 mb-2">Why Choose Rex9?</h2>
        <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
          <li>100% Welcome Bonus up to 20,000 BDT for new players</li>
          <li>Trusted local payment methods: Nagad, Bkash, Rocket, Upay</li>
          <li>Live cricket, BPL, IPL exchange and full sportsbook</li>
          <li>24/7 customer support via Live Chat, WhatsApp & Telegram</li>
        </ul>
      </section>

      <BottomCTA />
    </div>
  );
};

export default Index;
