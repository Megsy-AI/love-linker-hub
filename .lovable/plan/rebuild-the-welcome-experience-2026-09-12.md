# Rebuild the welcome experience

## Goal
Replace the current welcome carousel with the supplied “Built for Intelligent Performance” experience, adapted to the existing Megsy onboarding flow without changing account, trial, or navigation behavior.

## What will change
- Rebuild the welcome screen as the specified paper-gray, full-screen stage with the exact CloudFront desktop/mobile backgrounds.
- Use the three rigid glass capability cards, their supplied video assets, metric copy, dotted typography, layout ratios, and motion rules.
- Keep desktop fixed to one viewport; make phone layouts stack and scroll cleanly.
- Preserve the existing four-step completion logic by presenting the capability stage first and the existing trial choice as the final welcome step in the same visual system.
- Restyle the mobile sign-in and trial screens to match the new welcome system while preserving all working fields and actions.
- Remove the pre-hydration page snapshot injection causing the current rendering mismatch.

## Verification
- Sign in with the supplied test account without exposing or storing its credentials.
- Test welcome navigation, sign-in, and the resulting signed-in destination.
- Compare phone and desktop screenshots for clipping, overlap, scrolling, video fallbacks, and reduced-motion behavior.
- Run the relevant automated checks and confirm the preview has no persistent browser errors.

## Technical details
- Reuse the existing React/TanStack application rather than creating a disconnected standalone HTML file.
- Keep exact supplied asset URLs and card proportions where specified.
- Keep existing Supabase authentication and pricing actions unchanged.
