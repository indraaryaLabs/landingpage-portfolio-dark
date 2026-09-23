# RECON-based portfolio adaptation

## Decision

Use the user-supplied RECON export as a visual reference and source of its original asset URLs. Rebuild the public page in the existing React/Vite app rather than embedding exported Framer runtime code. Preserve the existing project-image CMS route and domain configuration. This supersedes the previous Lofi-inspired interpretation.

## Visual mapping

- White, black, Inter Tight editorial layout with a 76px sticky header.
- Compact hero with a circular template portrait and large two-line role title.
- The original dark moving collage sits directly below the hero as visual artwork.
- Large Featured work heading and three widely spaced, alternating project images, preserving the source's quiet negative space.
- About uses a two-column introduction and date-led experience rows.
- Large, centered contact footer and compact social links.
- Tablet and mobile stack the same content without horizontal overflow.

## Content and safety

Replace all Jay Brown, designer, Crosby, template-sales, fake tenure, and template social copy with Indra's verified profile, links, education, experience and three public projects. Keep professional work and public projects distinct. The supplied images and video are temporary template artwork, not screenshots of Indra's projects; label them as such in project captions and never describe the template portrait as Indra. Preserve CMS image slots so future user-uploaded project screenshots can replace each temporary work image.

## Verification

Build, targeted lint, browser checks at desktop/tablet/mobile, navigation and copy action, CMS route, and production-preview deployment. Check that no original identity or unsupported claims remain and that media failures have a graceful fallback. Do not merge to the main site before the user reviews the preview and confirms asset rights.
