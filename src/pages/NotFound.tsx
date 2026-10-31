import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-ink px-4 text-center text-paper">
      <h1 className="font-display text-[min(40vw,20rem)] font-bold leading-[0.85]">404</h1>
      <p className="mt-4 text-xl">Oops! Page not found</p>
      <a href="/" className="mt-8 rounded-full bg-honey px-6 py-3 font-semibold text-ink transition-transform hover:-translate-y-0.5 active:translate-y-0">
        Return to Home
      </a>
    </main>
  );
};

export default NotFound;
