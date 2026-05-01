import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Trophy, Spade, Hash, Dice5, Volleyball, Ticket,
} from "lucide-react";

const categories = [
  { id: "cricket", label: "Cricket", icon: Trophy, to: "/?cat=cricket" },
  { id: "casino", label: "Casino", icon: Spade, to: "/?cat=casino" },
  { id: "slot", label: "Slot", icon: Hash, to: "/?cat=slot" },
  { id: "table", label: "Table Game", icon: Dice5, to: "/?cat=table" },
  { id: "sportsbook", label: "Sportsbook", icon: Volleyball, to: "/?cat=sportsbook" },
  { id: "lottery", label: "Lottery", icon: Ticket, to: "/?cat=lottery" },
];

interface Props {
  active?: string;
  onChange?: (id: string) => void;
}

export const CategoryNav = ({ active = "cricket", onChange }: Props) => {
  const [internal, setInternal] = useState(active);
  const current = onChange ? active : internal;

  return (
    <nav className="bg-surface border-y border-border overflow-x-auto scrollbar-hide">
      <ul className="flex min-w-full">
        {categories.map((c) => {
          const Icon = c.icon;
          const isActive = current === c.id;
          return (
            <li key={c.id} className="flex-1 min-w-[88px]">
              <button
                onClick={() => (onChange ? onChange(c.id) : setInternal(c.id))}
                className={`w-full flex flex-col items-center gap-1 py-3 px-2 transition-smooth border-b-2 ${
                  isActive
                    ? "gradient-accent text-accent-foreground border-accent shadow-glow-accent"
                    : "text-foreground/80 border-transparent hover:bg-surface-elevated"
                }`}
              >
                <Icon className={`h-6 w-6 ${isActive ? "" : "text-accent"}`} strokeWidth={1.8} />
                <span className="text-xs font-semibold whitespace-nowrap">{c.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export { categories };
