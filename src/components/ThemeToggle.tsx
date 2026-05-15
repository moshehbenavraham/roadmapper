import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type ThemeChoice = "light" | "dark" | "system";

const NEXT_THEME: Record<ThemeChoice, ThemeChoice> = {
  light: "dark",
  dark: "system",
  system: "light",
};

const LABELS: Record<ThemeChoice, string> = {
  light: "Switch to dark theme",
  dark: "Switch to system theme",
  system: "Switch to light theme",
};

interface ThemeToggleProps {
  /**
   * Optional className applied to the Button. Use to recolor against dark
   * surfaces (e.g. the floating nav capsule on the landing page).
   */
  className?: string;
}

/**
 * Three-state theme cycle: light → dark → system → light.
 *
 * Renders a placeholder of identical dimensions during the first client render
 * so SSR/hydration mismatch warnings don't fire and layout doesn't shift.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={className}
        aria-hidden="true"
        tabIndex={-1}
      >
        <span className="block h-4 w-4" />
      </Button>
    );
  }

  const current = (theme as ThemeChoice) ?? "system";
  const next = NEXT_THEME[current] ?? "light";
  const label = LABELS[current] ?? "Toggle theme";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
    >
      {current === "light" && <Sun className="h-4 w-4" aria-hidden="true" />}
      {current === "dark" && <Moon className="h-4 w-4" aria-hidden="true" />}
      {current === "system" && <Monitor className="h-4 w-4" aria-hidden="true" />}
      <span className="sr-only">{label}</span>
    </Button>
  );
}

export default ThemeToggle;
