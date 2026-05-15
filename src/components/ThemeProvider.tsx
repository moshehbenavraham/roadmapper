import type { ComponentProps } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

/**
 * App-wide theme provider built on `next-themes`.
 *
 * Configured to match the `.dark` palette defined in `src/index.css`:
 * - `attribute="class"` toggles the `dark` class on <html>
 * - `defaultTheme="system"` honors the visitor's OS preference until they pick
 *   a value
 * - `enableSystem` keeps tracking OS preference changes when theme === "system"
 * - `disableTransitionOnChange` prevents CSS transitions on toggle to avoid
 *   janky color animations on theme switch
 *
 * An inline bootstrap script in `index.html` reads localStorage("theme") and
 * sets the `dark` class before paint to avoid a flash of incorrect theme.
 * Keep its logic in sync with the defaults above.
 */
export default function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
