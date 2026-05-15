import { Link } from "react-router-dom";
import { Route } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Link to="/" className="flex items-center justify-center gap-2 mb-6">
        <Route className="h-7 w-7 text-foreground" />
        <span className="font-display text-xl font-bold text-foreground">Roadmapper</span>
      </Link>
      <div className="w-full max-w-sm rounded-xl border border-border/60 bg-card shadow-lg shadow-black/8 p-8 space-y-8">
        {children}
      </div>
    </div>
  );
}
