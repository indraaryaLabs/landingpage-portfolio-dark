# Portfolio CMS aligned with the RECON landing page

## Outcome and scope

Replace the inherited dark, generic dashboard with a light, monochrome, Inter Tight editor that follows the public page's visual language and section order. The owner can edit the header, hero, featured work, about/experience, and footer, including the hero portrait, reel video, and each project image. Keep the public layout and animation intact. Replace public references to Kendari with Indonesia. Do not edit, delete, or rename synced project source files.

## Approach

Use a structured section editor, not a free-form page builder. A page builder risks breaking the approved design; extending the old table-specific dashboard leaves most of the new page disconnected. Store a versioned `portfolio_content` JSONB document in the existing `site_settings` singleton row. Its defaults live in source control and contain only verified portfolio claims. The CMS edits this document, uploads media to the existing `portfolio-media` bucket, and saves the document as one unit. Existing project rows remain untouched; any verified legacy screenshots can be used as fallback until the owner replaces them.

## Interface and data flow

The admin shell uses a white canvas, black text, thin rules, large editorial headings, compact pill navigation, and responsive cards. Navigation maps to the landing sections: Overview, Hero & media, Featured work, About, Footer. Each editor shows the current asset, its recommended dimensions, and an explicit Save action. A media upload is not published until Save succeeds. The public page loads defaults immediately, then overlays saved content; if Supabase is unavailable or an asset is unset, it retains the current template content. Sections and asset slots are fixed so an edit cannot rearrange the Framer composition.

## Safety and proof

Keep claims editable only by the owner, and do not introduce new factual assertions in defaults. Validate required fields, URL schemes, media types and upload sizes. Scope database and storage writes to the confirmed admin account; public reads remain available. Do not put a database password in frontend code. Verify the schema, RLS, admin save/reload, public rendering, image/video fallback, mobile/desktop presentation, build, targeted lint, and deployment preview. Do not merge the PR to main before review.
