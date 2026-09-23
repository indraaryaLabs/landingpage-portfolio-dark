# Indra Arya — software engineering portfolio

Source for [indraarya.vercel.app](https://indraarya.vercel.app/), a portfolio for Indra Arya Slamet Praditya. The public page presents verified experience, selected projects and contact information.

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

The public portfolio is rendered from local data and does not require Supabase credentials. The repository still contains an older CMS/admin implementation that uses Supabase; it is not the source of the current public homepage. Do not run the legacy seed scripts without reviewing their content, because the starter records contain unsupported sample claims.

## Stack

React, Vite, CSS, Lucide. Legacy CMS/admin code additionally uses Supabase.

## Contact

[contact.indraarya@gmail.com](mailto:contact.indraarya@gmail.com) · [LinkedIn](https://www.linkedin.com/in/indraaryaslametpraditya/) · [GitHub](https://github.com/indraaryaLabs)
