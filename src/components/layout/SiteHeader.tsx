import { Link, useNavigate } from "react-router-dom";
import { Menu, Wallet, LogOut, User as UserIcon, Shield } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const SiteHeader = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 gradient-primary border-b border-primary-glow/30 shadow-elevated">
      <div className="container flex items-center justify-between h-14 px-3">
        <Sheet>
          <SheetTrigger asChild>
            <button className="text-white p-1.5 -ml-1.5 hover:bg-white/10 rounded transition-smooth" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-surface border-border w-72">
            <SheetHeader>
              <SheetTitle className="text-foreground">
                <Link to="/"><img src={logo} alt="JAYA9" className="h-10" /></Link>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 mt-6">
              <Link to="/" className="px-3 py-2.5 rounded hover:bg-surface-elevated text-foreground">Home</Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="px-3 py-2.5 rounded hover:bg-surface-elevated text-foreground flex items-center gap-2"><UserIcon className="h-4 w-4" /> Dashboard</Link>
                  <Link to="/deposit" className="px-3 py-2.5 rounded hover:bg-surface-elevated text-foreground flex items-center gap-2"><Wallet className="h-4 w-4" /> Deposit</Link>
                  {isAdmin && <Link to="/admin" className="px-3 py-2.5 rounded hover:bg-surface-elevated text-accent flex items-center gap-2"><Shield className="h-4 w-4" /> Admin Panel</Link>}
                  <button onClick={signOut} className="px-3 py-2.5 rounded hover:bg-surface-elevated text-foreground flex items-center gap-2 text-left"><LogOut className="h-4 w-4" /> Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-2.5 rounded hover:bg-surface-elevated text-foreground">Login</Link>
                  <Link to="/register" className="px-3 py-2.5 rounded hover:bg-surface-elevated text-foreground">Register</Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <img src={logo} alt="JAYA9" className="h-9" width={120} height={36} />
        </Link>

        {user ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="hidden sm:flex items-center gap-1.5 text-white text-sm bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition-smooth"
            >
              <Wallet className="h-4 w-4 text-accent" />
              ৳ {Number(profile?.balance ?? 0).toFixed(2)}
            </button>
            <Button variant="hero" size="sm" onClick={() => navigate("/deposit")}>Deposit</Button>
          </div>
        ) : (
          <Button variant="outlineLight" size="sm" asChild>
            <Link to="/register">Register</Link>
          </Button>
        )}
      </div>
    </header>
  );
};
