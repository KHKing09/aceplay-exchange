import { Crown, Spade, Gamepad2, Trophy, Dices, Heart, Flame, Diamond, Star, Award } from "lucide-react";

export interface GameTile {
  id: string;
  name: string;
  category: string;
  badge?: "HOT" | "NEW";
  color: string;
  icon: typeof Crown;
}

export const games: GameTile[] = [
  { id: "betswiz", name: "BetSwiz", category: "cricket", badge: "HOT", color: "from-emerald-700 to-emerald-900", icon: Trophy },
  { id: "kingmaker", name: "KingMaker", category: "table", color: "from-amber-600 to-amber-900", icon: Crown },
  { id: "jili", name: "JILI", category: "table", badge: "HOT", color: "from-yellow-500 to-yellow-800", icon: Diamond },
  { id: "ludo", name: "Ludo", category: "table", badge: "NEW", color: "from-sky-500 to-blue-800", icon: Dices },
  { id: "redtiger", name: "Red Tiger", category: "table", badge: "NEW", color: "from-rose-700 to-red-950", icon: Flame },
  { id: "pragmatic", name: "Pragmatic", category: "casino", badge: "HOT", color: "from-orange-600 to-orange-900", icon: Crown },
  { id: "evo", name: "Evo", category: "casino", color: "from-slate-500 to-slate-800", icon: Star },
  { id: "ac", name: "AC Casino", category: "casino", color: "from-pink-600 to-pink-900", icon: Heart },
  { id: "fc", name: "FC", category: "slot", color: "from-zinc-700 to-zinc-950", icon: Award },
  { id: "jdb", name: "JDB", category: "slot", badge: "HOT", color: "from-amber-500 to-orange-800", icon: Diamond },
  { id: "pg", name: "PG", category: "slot", badge: "HOT", color: "from-fuchsia-600 to-purple-900", icon: Gamepad2 },
  { id: "spade", name: "Spade", category: "slot", badge: "HOT", color: "from-red-700 to-red-950", icon: Spade },
];

export const GameGrid = ({ category }: { category: string }) => {
  const filtered = games.filter((g) => g.category === category);
  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Coming soon for this category.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-3 animate-fade-in">
      {filtered.map((g) => {
        const Icon = g.icon;
        return (
          <button
            key={g.id}
            className={`relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br ${g.color} shadow-card hover:shadow-elevated hover:scale-[1.03] transition-smooth group`}
          >
            {g.badge && (
              <span className={`absolute top-1.5 right-1.5 z-10 text-[10px] font-bold px-1.5 py-0.5 rounded ${g.badge === "HOT" ? "bg-destructive text-destructive-foreground" : "bg-success text-success-foreground"}`}>
                {g.badge}
              </span>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon className="h-14 w-14 text-white/95 drop-shadow-lg group-hover:scale-110 transition-smooth" strokeWidth={1.5} />
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <p className="text-xs font-bold text-white text-center">{g.name}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
