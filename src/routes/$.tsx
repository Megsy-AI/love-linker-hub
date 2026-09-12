import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useState } from "react";

// Client-only: the whole Megsy app (its own router included) mounts here.
// Dynamic imports keep every app module out of the SSR module graph.
/**
 * After a new deploy the old HTML can point at chunk files that no longer
 * exist, so the dynamic import rejects and the screen stays blank. Retry once,
 * then reload from the network a single time per session.
 */
function loadChunk<T>(load: () => Promise<T>): Promise<T> {
  return load().catch(async (err) => {
    await new Promise((r) => setTimeout(r, 400));
    try {
      return await load();
    } catch {
      if (typeof window !== "undefined" && !sessionStorage.getItem("chunk-reloaded")) {
        sessionStorage.setItem("chunk-reloaded", "1");
        window.location.reload();
      }
      throw err;
    }
  });
}

const SpaApp = lazy(() => loadChunk(() => import("@/lib/SpaApp")));

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
