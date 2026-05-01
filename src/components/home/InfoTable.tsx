const rows: [string, React.ReactNode][] = [
  ["Website", <a href="#" className="text-primary-glow underline">rex9.com</a>],
  ["Established", "2021"],
  ["Games", "Online Slots, Live Casino, Fishing, Sportsbook (IPL, BPL), Crash, Arcade"],
  ["License", "Gaming Curacao"],
  ["Support", <span className="text-primary-glow">24/7 Live Chat, WhatsApp, Telegram, Messenger & Email</span>],
  ["Payments", "Bank Transfer (BKash, Nagad, Rocket), eWallets, Crypto"],
  ["Platforms", "Mobile (Android & iOS), Tablet, Desktop"],
  ["Promotions", "🎁 20,000 BDT Welcome Bonus, Cashback, Daily Events"],
  ["Security", "SSL Encryption, Fair Play Guaranteed"],
];

export const InfoTable = () => (
  <div className="mx-3 my-4 rounded-xl overflow-hidden border border-border bg-surface shadow-card">
    <table className="w-full text-sm">
      <tbody>
        {rows.map(([label, value], i) => (
          <tr key={i} className={i % 2 === 0 ? "bg-surface" : "bg-surface-elevated"}>
            <td className="py-2.5 px-3 font-semibold text-foreground/80 w-[35%] border-r border-border align-top">{label}</td>
            <td className="py-2.5 px-3 text-foreground">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
