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

## Pre-publish review (full pass)
- [x] Signed-in audit of /chat, /settings, /billing, /usage, /referrals, /notifications, /pricing, /auth (desktop + mobile, no horizontal overflow)
- [x] Services verified live: chat, computer agent (browsing), image generation, research, website build, slides
- [x] Fixed provider model routing: app model ids (e.g. kimi-k3) are mapped to valid upstream ids instead of failing with model_not_found (502)
- [x] Fixed hard-coded Arabic labels in the computer task card (now follow interface language)
- [x] Production build passes; all routes return 200 (no soft-404 deep-link issue like the old megsyai.com host)
- [ ] Provider billing: the stored abliteration key reports insufficient credits for the direct /api/chat path (production chat goes through the Supabase function and works)

- [ ] ربط الموقع بجدول service_keys (Cerebras نصوص / DeAPI + Renderful صور وفيديو / Browser Use الوكيل) بدل abliteration — المفاتيح مشفرة ومحتاجة مفتاح فك التشفير

## نتيجة الاختبارات السبعة (12 سبتمبر)
1. الأنواع + البناء: ناجح.
2. كل المسارات ترجع 200 محليًا.
3. أحجام الحزم: أكبر الملفات (elk / pptx / shiki) كلها lazy — مقبول.
4. الهاتف + الكمبيوتر: لا يوجد أي تجاوز أفقي في كل الصفحات.
5. الدخول بالحساب التجريبي: كل الصفحات المحمية تعمل.
6. الدردشة تعمل عبر Cerebras. أُصلح نداء /api/chat المعطّل (502) في fastChat.
7. فحص الأمان: أُصلح تسريب prompt، وتزوير الإحالات، والتلاعب بإحصاءات الزيارات.

### مفتوح
- النموذج أحيانًا يطبع "تفكيره" داخل الرد (سلوك المزود/الـ edge function وليس الواجهة).
- Leaked password protection غير مفعّل في إعدادات Supabase Auth (يحتاج تفعيل يدوي).
- تحذير React: setState أثناء render في Transitioner (غير مؤثر).
