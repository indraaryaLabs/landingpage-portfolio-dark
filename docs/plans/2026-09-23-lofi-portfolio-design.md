# Lofi-inspired engineering portfolio

## Decision

Rebuild the public homepage in the existing React/Vite project, using Lofi Folio as a visual reference rather than copying the paid Framer template or its assets. Keep the existing Vercel domain, verified content model, and project-image CMS. Do not merge the superseded dark-design pull request.

## Visual direction

A quiet editorial portfolio: white background, nearly black type, Inter Tight display typography, compact uppercase navigation, a circular grayscale portrait, oversized section headings, and generously spaced project panels. Project fallback artwork is original typographic composition rather than mock screenshots; uploaded CMS screenshots replace it. Responsive layout turns the desktop hero's portrait/text columns into a portrait-first mobile stack.

## Content and flow

1. Header: name, Work and About anchors, email action.
2. Hero: circular real portrait; factual junior software-engineer positioning; concise PickFrame and project context.
3. Work: three verified public repositories, plus a distinct PickFrame live-product feature. The three repositories retain exact CMS image-slot matching and open to their source; PickFrame opens its site.
4. About: verified summary, clearly separated PickFrame freelance experience, Wesclic internship, education, and concise skills.
5. Footer: direct email, GitHub and LinkedIn.

## Constraints and checks

- No unsupported metrics, seniority, testimonials, client names or fake screenshots.
- Preserve `/admin/projects` and its Supabase integration without editing CMS code.
- No purchased Framer assets or extracted template source.
- Verify production build, targeted lint, desktop/mobile browser layout, navigation and CMS route. Measure Lighthouse on the built site.
