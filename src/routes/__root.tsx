import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";

import { reportLovableError } from "../lib/lovable-error-reporting";

const BOOT_STYLE = `
:root { color-scheme: dark; }
html, body { background-color: #1c1c1c; margin: 0; }
#root { min-height: 100dvh; background-color: #1c1c1c; }
#root[data-snapshot-preview="true"] { pointer-events: none; user-select: none; contain: paint; }
#boot-mark {
  position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
  font: 500 15px/1 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.42);
  animation: boot-pulse 1.6s ease-in-out infinite; pointer-events: none;
}
@keyframes boot-pulse { 0%,100% { opacity: 0.35; } 50% { opacity: 0.85; } }
@media (prefers-reduced-motion: reduce) { #boot-mark { animation: none; } }
`;

const GARAMOND_STYLE = `
@font-face {
  font-family: "ITC Garamond Std Narrow"; font-weight: 300; font-style: normal; font-display: swap;
  src: url("https://res.cloudinary.com/dgupuutfn/raw/upload/v1783596334/ITCGaramondStd-LtNarrow_i2zcip.woff2") format("woff2"),
       url("https://res.cloudinary.com/dgupuutfn/raw/upload/v1783596334/ITCGaramondStd-LtNarrow_soc5vc.woff") format("woff");
}
@font-face {
  font-family: "ITC Garamond Std Narrow"; font-weight: 400; font-style: normal; font-display: swap;
  src: url("https://res.cloudinary.com/dgupuutfn/raw/upload/v1783596334/ITCGaramondStd-BkNarrow_xjfoc0.woff2") format("woff2"),
       url("https://res.cloudinary.com/dgupuutfn/raw/upload/v1783596334/ITCGaramondStd-BkNarrow_xjfoc0.woff") format("woff");
}
@font-face {
  font-family: "ITC Garamond Std Narrow"; font-weight: 400; font-style: italic; font-display: swap;
  src: url("https://res.cloudinary.com/dgupuutfn/raw/upload/v1783596334/ITCGaramondStd-BkNarrowIta_hiy9ld.woff2") format("woff2"),
       url("https://res.cloudinary.com/dgupuutfn/raw/upload/v1783596334/ITCGaramondStd-BkNarrowIta_rlarxo.woff") format("woff");
}
@font-face {
  font-family: "ITC Garamond Std Narrow"; font-weight: 500; font-style: normal; font-display: swap;
  src: url("https://res.cloudinary.com/dgupuutfn/raw/upload/v1783596334/ITCGaramondStd-BkNarrow_xjfoc0.woff2") format("woff2"),
       url("https://res.cloudinary.com/dgupuutfn/raw/upload/v1783596334/ITCGaramondStd-BkNarrow_xjfoc0.woff") format("woff");
}
`;

const TELEGRAM_SCRIPT = `(function () {
  try {
    var inTelegram =
      /[?#&]tgWebApp/.test(location.href) ||
      "TelegramWebviewProxy" in window ||
      /Telegram/i.test(navigator.userAgent);
    if (!inTelegram) return;
    document.write('<script src="https://telegram.org/js/telegram-web-app.js"><\\/script>');
  } catch (e) {}
})();`;

const DEFERRED_FONTS_SCRIPT = `(function () {
  var HREF =
    "https://fonts.googleapis.com/css2?family=Inter:wght@700&family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&family=DM+Sans:wght@400;500;600;700&family=Noto+Serif+Arabic:wght@400;600;700&family=Almarai:wght@300;400;700;800&family=Cairo:wght@400;500;600;700&family=Tajawal:wght@400;500;700&family=Readex+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Sora:wght@400;500;600;700;800&family=Archivo+Black&family=Manrope:wght@400;500;600;700&display=swap";
  var EXTRA =
    "https://db.onlinewebfonts.com/c/e66905e07608167a84e6ad52f638c3c6?family=Helvetica+Now+Var";
  function add(href) {
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  }
  function go() {
    try {
      var c = navigator.connection || {};
      if (c.saveData) return;
      if (/2g/.test(c.effectiveType || "")) return;
    } catch (e) {}
    var run = function () { add(HREF); add(EXTRA); };
    if (window.requestIdleCallback) requestIdleCallback(run, { timeout: 3000 });
    else setTimeout(run, 800);
  }
  if (document.readyState === "complete") go();
  else window.addEventListener("load", go, { once: true });
})();`;

const SPECULATION_SCRIPT = `(function () {
  try {
    var nav = navigator;
    var c = nav.connection || {};
    var slow = c.saveData === true || /(^|-)(2g|slow-2g)$/.test(c.effectiveType || "");
    var weak = (nav.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory || 8) <= 4;
    if (slow || weak) return;
    var add = function () {
      var s = document.createElement("script");
      s.type = "speculationrules";
      s.textContent = JSON.stringify({
        prerender: [
          {
            source: "document",
            where: {
              and: [
                { href_matches: "/*" },
                { not: { href_matches: "/api/*" } },
                { not: { href_matches: "/auth/*" } },
              ],
            },
            eagerness: "moderate",
          },
        ],
        prefetch: [
          { source: "document", where: { href_matches: "/*" }, eagerness: "conservative" },
        ],
      });
      document.body.appendChild(s);
    };
    if (document.readyState === "complete") setTimeout(add, 1200);
    else addEventListener("load", function () { setTimeout(add, 1200); });
  } catch (e) {}
})();`;

const ORG_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Megsy AI",
  url: "https://megsyai.com/",
  logo: "https://megsyai.com/app-icon-512.png",
  sameAs: ["https://x.com/megsyai", "https://www.instagram.com/megsyai"],
  description:
    "All-in-one AI platform for chat, images, video, slides, docs and apps — every top model in one place.",
});

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm opacity-70">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">This page didn't load</h1>
        <p className="mt-2 text-sm opacity-70">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, viewport-fit=cover, interactive-widget=resizes-content",
      },
      { name: "google", content: "notranslate" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Megsy" },
      { name: "application-name", content: "Megsy AI" },
      { name: "theme-color", content: "#ffffff" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "format-detection", content: "telephone=no" },
      { title: "Megsy AI — All-in-One AI Platform for Chat, Images & Video" },
      {
        name: "description",
        content:
          "Chat, generate images, create videos, build slides, docs and full apps — one AI platform with every top model. Free to start.",
      },
      { property: "og:title", content: "Megsy AI — All-in-One AI Platform for Chat, Images & Video" },
      {
        property: "og:description",
        content:
          "Chat, generate images, create videos, build slides, docs and full apps — one AI platform with every top model. Free to start.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://megsyai.com/" },
      { property: "og:site_name", content: "Megsy AI" },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "ar_EG" },
      { property: "og:image", content: "https://megsyai.com/og-megsy.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Megsy AI — All-in-One AI Platform" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://megsyai.com/og-megsy.jpg" },
    ],
    links: [
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/app-icon-32.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/app-icon-192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/app-icon-512.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/app-icon-180.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://qdnqxjzjecaieuavagvq.supabase.co", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://qdnqxjzjecaieuavagvq.supabase.co" },
      { rel: "preconnect", href: "https://d8j0ntlcm91z4.cloudfront.net", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://d8j0ntlcm91z4.cloudfront.net" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="dark" translate="no">
      <head>
        <style dangerouslySetInnerHTML={{ __html: BOOT_STYLE }} />
        <style dangerouslySetInnerHTML={{ __html: GARAMOND_STYLE }} />
        <script dangerouslySetInnerHTML={{ __html: TELEGRAM_SCRIPT }} />
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: DEFERRED_FONTS_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ORG_JSON_LD }} />
      </head>
      <body>
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <defs>
            <filter id="megsy-glass-warp" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.008 0.014"
                numOctaves="2"
                seed="7"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="28"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
        <div id="root">
          <div id="boot-mark">Megsy</div>
          {children}
        </div>
        <script dangerouslySetInnerHTML={{ __html: SPECULATION_SCRIPT }} />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
