# Indra Arya — software engineering portfolio

Source for [indraarya.satuarah.click](https://indraarya.satuarah.click/), a portfolio for Indra Arya Slamet Praditya. The public page presents verified experience, selected projects and contact information.

## What is on the public page

- Freelance full-stack work on PickFrame, separated from the Wesclic content/project-coordination internship.
- Links to the Jejak Karier, Reliability Command Center and E-commerce ETL Pipeline repositories.
- Education, skills, location and availability.

Portfolio copy is maintained in [`src/data/portfolio.js`](src/data/portfolio.js). Claims should only be changed when they can be supported by a project, work record or other evidence. Do not add client testimonials, success rates, project counts or rankings without documentation.

## Run locally

```bash
git clone https://github.com/indraaryaLabs/landingpage-portfolio-dark.git
cd landingpage-portfolio-dark
npm ci
npm run dev
```

Open `http://localhost:5173`. Run `npm run build` for a production build.

The public copy is rendered from local data; Supabase is optional for displaying the page. The protected editor at `/admin/projects` uses Supabase Auth, the existing `projects` table and the `portfolio-media` Storage bucket to let the owner upload a 16:9 screenshot for each verified project. The screenshot is resized and saved as WebP. An image is used publicly only when its stored slot and project URL match the verified project. Until then, the page shows a lightweight illustration.

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the hosting environment to enable the editor and public project images. Storage upload and table update policies must permit the authenticated owner. Never put a Supabase service-role key in `VITE_` variables. The old CMS files remain in the repository for reference, but only the project-image editor is routed. Do not run the legacy seed scripts: their starter records include unsupported sample claims.

The public page keeps a local copy of the current portrait at `public/images/portrait.webp`. It displays that copy when the CMS or its Storage service is unavailable. The `Keep portfolio CMS active` GitHub Actions workflow makes small read requests every six hours using the `PORTFOLIO_SUPABASE_URL` and `PORTFOLIO_SUPABASE_ANON_KEY` repository secrets. This can help a Free Plan project avoid inactivity pausing, but Supabase only guarantees no inactivity pausing on a paid plan. GitHub may also disable scheduled workflows in a public repository after 60 days without repository activity; check that the workflow remains enabled.

## Stack

React, Vite, CSS, self-hosted Manrope and Instrument Serif fonts, Lucide, and Supabase for project-image editing.

## Contact

[contact.indraarya@gmail.com](mailto:contact.indraarya@gmail.com) · [LinkedIn](https://www.linkedin.com/in/indraaryaslametpraditya/) · [GitHub](https://github.com/indraaryaLabs)
