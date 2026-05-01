import { Megaphone } from "lucide-react";

export const MarqueeBar = ({ text }: { text: string }) => (
  <div className="bg-primary border-b border-primary-glow/30 flex items-center gap-2 px-3 py-1.5 overflow-hidden">
    <Megaphone className="h-4 w-4 text-accent shrink-0" />
    <div className="overflow-hidden flex-1">
      <p className="text-xs text-white/90 whitespace-nowrap animate-marquee">{text}</p>
    </div>
  </div>
);
