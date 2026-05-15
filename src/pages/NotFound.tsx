import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import SEOHead from "@/components/SEOHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SEOHead
        title="Page not found — Roadmapper"
        description="The page you were looking for could not be found."
        url={location.pathname}
        noindex
      />
      <main className="text-center space-y-3" aria-labelledby="not-found-title">
        <h1 id="not-found-title" className="font-display text-5xl font-bold text-foreground">404</h1>
        <p className="font-body text-lg text-muted-foreground">Page not found</p>
        <Link to="/" className="inline-block font-display text-sm text-primary hover:text-primary/80 underline underline-offset-4">
          Return to Home
        </Link>
      </main>
    </div>
  );
};

export default NotFound;
