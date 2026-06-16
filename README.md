# 🌌 Sleek Dynamic Portfolio & CMS Dashboard

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-DB%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-Schema%20Mapper-C5F900?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

A modern, high-performance portfolio landing page featuring premium dark glassmorphism aesthetics, fluid Framer Motion animations, and a secure, fully-integrated Admin CMS Dashboard to manage all page components in real-time.

---

## 📸 Preview Section

*Enhance your repository's first impression by including UI screenshots of the live landing page and its admin controls.*

| Main Landing Page (Dark Theme) | Admin CMS Dashboard Panel |
|:---:|:---:|
| ![Landing Page Preview](https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop) *Hero and Recent Projects showcase* | ![Admin Dashboard Preview](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop) *Settings, Projects, and Testimonials Editors* |

---

## ✨ Core Features

### 🎨 Premium Frontend & UX
* **Modern Dark Theme**: Tailored HSL colors, deep gradients, and full glassmorphism elements.
* **Scroll-Triggered Reveals**: Smooth custom intersection observer hooks for fade-in animations.
* **Fluid Micro-animations**: Powered by Framer Motion for responsive interactive states (hover, focus, page transitions).
* **Responsive Architecture**: Fully optimized for mobile, tablet, and desktop views.

### 🛡️ Admin CMS Dashboard (`/admin`)
* **Secure Authentication**: Protected routes powered by Supabase Auth (Sign-in, Session recovery, and Sign-out flow).
* **Live Settings Editor**: Customize hero metadata, bio, avatar, contact details, and social links instantly.
* **Granular Component Managers**: Dedicated interfaces to add, modify, and delete:
  * **Work Experience**: Sortable timeline entries.
  * **Projects Gallery**: Dynamic grid slots, categories, overlay details, and live links.
  * **Services & Workflows**: Step-by-step progress cards and pricing.
  * **Social/Proof Blocks**: Testimonials (with star ratings) and custom FAQs.
* **Interactive Inbox**: Real-time read/unread tracking for messages submitted via the contact form.

### ⚙️ Database & Infrastructure
* **Drizzle ORM Mapping**: Strongly typed relational schema definition (`src/db/schema.js`).
* **Supabase PostgreSQL**: Managed backend using Row Level Security (RLS) policies to protect admin modifications while exposing public read access.
* **Media Storage Bucket**: Custom automated storage setup for image uploads within a public bucket.

---

## 🛠️ Tech Stack

| Category | Technology | Description |
|---|---|---|
| **Core Framework** | **React 19** | Dynamic declarative component architecture. |
| **Build Tool** | **Vite 8** | Rapid bundling, Hot Module Replacement (HMR), and dev-server. |
| **Styling** | **Tailwind CSS v4** | Modern utility-first CSS engine with CSS-native theme variables. |
| **Database** | **PostgreSQL** | Managed database server hosted on Supabase. |
| **Database ORM** | **Drizzle ORM** | Schema design and local migration query definitions. |
| **Authentication** | **Supabase Auth** | Client-side email/password authentication token workflow. |
| **Animations** | **Framer Motion** | Complex UI transitions and card hover animations. |
| **Icons** | **Lucide React** | Premium UI iconography. |

---

## 📂 Project Architecture

```bash
landingpage-portfolio-dark/
├── drizzle/                # Auto-generated Drizzle Kit migrations
├── public/                 # Static assets (favicons, manifest)
├── src/
│   ├── assets/             # Brand logos & imagery
│   ├── cms/                # CMS Components & Auth Middleware
│   │   ├── admin/          # Admin Dashboard layout, views & LoginPage
│   │   │   ├── components/ # Dash widgets & common UI blocks
│   │   │   └── editors/    # Section editors (Projects, Settings, FAQ, etc.)
│   │   └── AuthContext.jsx # React context wrapper for Supabase Auth state
│   ├── components/         # Shared portfolio components (Hero, Nav, Bento, Footer)
│   ├── db/                 # Drizzle Schema definitions
│   ├── hooks/              # Custom query handlers (useSiteData, useSupabaseQuery)
│   ├── lib/                # Database connections, scripts, and API abstraction
│   │   ├── migrate.mjs     # Direct SQL migrations script
│   │   ├── seed.mjs        # Database initial data seeder script
│   │   ├── fix-storage.mjs # Supabase storage initialization script
│   │   ├── supabaseApi.js  # CRUD functions for each DB model
│   │   └── supabaseClient.js # Supabase Client singleton configuration
│   ├── pages/              # Main routing views (Home, ProjectDetail)
│   ├── App.jsx             # Main Router structure
│   ├── index.css           # Global layout & utility rules
│   └── main.jsx            # React root mount entrypoint
├── drizzle.config.js       # Drizzle Kit configuration options
├── tailwind.config.js      # PostCSS Tailwind config
└── vite.config.js          # Vite configuration with React plugins
```

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 📋 Prerequisites
* **Node.js**: Ensure you have Node.js version 18 or above.
* **Supabase Project**: Set up a free account and create a project at [supabase.com](https://supabase.com/).

### 1. Installation
Clone the repository and install all required node modules:
```bash
git clone https://github.com/your-username/landingpage-portfolio-dark.git
cd landingpage-portfolio-dark
npm install
```

### 2. Environment Variables Setup
Create a `.env` file in the root directory and configure the variables:
```env
# Supabase Client Credentials
VITE_SUPABASE_URL="https://your-supabase-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"

# Database Connection URI (Used for migrations)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"
```
> [!IMPORTANT]
> * Ensure your database connection URI contains your correct database password.
> * The client variables must begin with `VITE_` to be loaded correctly by Vite.

### 3. Database Initialization
Prepare your Supabase instance by running the migration, setup storage, and seeding commands.

1. **Update Connection Strings (If Needed)**:
   Ensure your database connection string in `src/lib/migrate.mjs`, `src/lib/seed.mjs`, and `src/lib/fix-storage.mjs` matches your Postgres URL.
   *(Tip: You can modify these files to dynamically load the connection string from `process.env.DATABASE_URL` via `dotenv` check).*

2. **Execute Migrations**:
   Run the schema migration to create the tables in your database:
   ```bash
   node src/lib/migrate.mjs
   ```

3. **Configure Storage**:
   Set up the required public bucket `portfolio-media` along with Row Level Security (RLS) rules:
   ```bash
   node src/lib/fix-storage.mjs
   ```

4. **Seed Database**:
   Populate the tables with beautiful starter content:
   ```bash
   node src/lib/seed.mjs
   ```

### 4. Admin Account Creation
To access the Admin Dashboard, create an administrator user within your Supabase project:
1. Navigate to the **Supabase Dashboard** -> **Authentication** -> **Users**.
2. Click **Add User** -> **Create User**.
3. Provide an email and password that you will use to log in at the `/admin/login` page of your local app.
4. Disable "Confirm User Email" in settings if you want to skip email confirmation steps.

### 5. Run the Application
Start the local development server:
```bash
npm run dev
```
Open your browser to `http://localhost:5173` to view the landing page, or go to `http://localhost:5173/admin/login` to log into your CMS.

---

## 🛠️ Build & Deployment Guide

### Building for Production
To generate optimized production assets in the `dist` directory:
```bash
npm run build
```
You can test the production build locally prior to publishing by running:
```bash
npm run preview
```

### Deploying to Vercel
This project includes a native `vercel.json` configuration for hosting:
1. Import your repository into Vercel.
2. Set up the environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in the Vercel project settings.
3. Vercel will auto-detect Vite settings and deploy the static build seamlessly.

---

## 🤝 Contributing Guide

Contributions are welcome! Please follow these guidelines:
1. **Fork the Project** to your own account.
2. **Create a Feature Branch** (`git checkout -b feature/NewFeature`).
3. **Commit Your Changes** with readable messages (`git commit -m 'Add some NewFeature'`).
4. **Push to the Branch** (`git push origin feature/NewFeature`).
5. **Open a Pull Request** describing your additions and changes.

---

## 🗺️ Roadmap
- [ ] **Multi-language Support (i18n)**: Switch language settings between Indonesian and English directly from the header.
- [ ] **Dark/Light Mode Toggle**: Allow users to toggle between premium dark aesthetics and clean, accessible light mode configurations.
- [ ] **Advanced Analytics Widget**: Integrate a simple visitor/message statistics view in the admin home dashboard.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](file:///c:/Users/Indra/Downloads/PROJECT/landingpage-portfolio-dark/LICENSE) for more details.

---

## 🧑‍💻 Author

**Indra Arya**
* **Website**: [indraarya.vercel.app](https://indraarya.vercel.app)
* **Instagram**: [@indraarrya](https://www.instagram.com/indraarrya/)
* **Email**: [indraarya77.ia@gmail.com](mailto:indraarya77.ia@gmail.com)

---
*Built with ❤️ to elevate modern portfolio workflows.*
