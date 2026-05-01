import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const BottomCTA = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  if (user) return null;
  if (["/login", "/register"].includes(pathname)) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 grid grid-cols-2 shadow-elevated">
      <Link
        to="/login"
        className="gradient-primary text-primary-foreground text-center py-3.5 font-bold tracking-wide hover:brightness-110 transition-smooth"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="gradient-accent text-accent-foreground text-center py-3.5 font-bold tracking-wide hover:brightness-110 transition-smooth"
      >
        Register
      </Link>
    </div>
  );
};
