# Roadmap

## Import love-linker (Megsy AI) into this project
- [x] Copy app source (src content, public, styles, configs) keeping the Lovable template shell
- [x] Merge package.json dependencies and install
- [x] Merge Tailwind config (v3 config via @config on Tailwind v4; dropped tailwindcss-rtl, v4 has logical props natively)
- [x] Set Supabase env vars from source .env
- [x] Wire fonts/index.html head tags into template root (src/routes/__root.tsx)
- [x] Mount app client-side via splat route (src/routes/$.tsx + src/lib/SpaApp.tsx + src/lib/spaBoot.ts); build + preview verified
- [x] Adapt /api/* serverless functions to TanStack server routes (src/routes/api/*, incl. /api/deep-research and /api/dev-admin aliases)

## Follow-up fixes
- [x] Pricing page trial explanation — already present in imported code (pricing banner + onboarding trial slide)
- [x] Onboarding slide 4 image — already present (welcome-trial-korean-editorial-v1.jpg)
- [x] Snapshot capture on leave from first visit + clean #root before React mounts (spaBoot.ts)
- [x] Typecheck (relaxed tsconfig mirroring source repo) + production build passes
- [ ] Computer view on chat page — /api/computer-agent now wired (401 without auth, as expected); needs a signed-in test by the user to confirm end-to-end

## Keys & onboarding (current)
- [x] Read provider keys from DB tables (abliteration_keys + provider_api_keys) instead of env for chat & deep research
- [ ] Replace onboarding slide 4 image and fix clipped text
