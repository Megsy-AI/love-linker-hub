import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useState } from "react";

// Client-only: the whole Megsy app (its own router included) mounts here.
// Dynamic imports keep every app module out of the SSR module graph.
const SpaApp = lazy(() => import("@/lib/SpaApp"));

export const Route = createFileRoute("/$")({
  ssr: false,
  component: SpaMount,
});

function SpaMount() {
  // Boot side effects (snapshot cleanup, auth patch, perf tier, welcome
  // redirect, global listeners) must run BEFORE the app tree mounts.
  const [booted, setBooted] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void import("@/lib/spaBoot").then(() => {
      if (!cancelled) setBooted(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!booted) return null;
  return (
    <Suspense fallback={null}>
      <SpaApp />
    </Suspense>
  );
}
