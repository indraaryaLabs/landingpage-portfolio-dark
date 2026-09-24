import { pgTable, serial, text, varchar, timestamp, integer, boolean, numeric, jsonb } from 'drizzle-orm/pg-core';

// ============================================
// Site Settings — Hero content & global config
// ============================================
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  badgeText: varchar('badge_text', { length: 100 }),
  heroName: varchar('hero_name', { length: 100 }),
  heroHeading: text('hero_heading'),
  avatarUrl: text('avatar_url'),
  contactEmail: varchar('contact_email', { length: 255 }),
  // Profile & About section
  profileImageUrl: text('profile_image_url'),
  aboutBio: text('about_bio'),
  skillsCsv: text('skills_csv'),
  // Social links
  socialTwitter: text('social_twitter'),
  socialInstagram: text('social_instagram'),
  socialFacebook: text('social_facebook'),
  socialWebsite: text('social_website'),
  portfolioContent: jsonb('portfolio_content').notNull().default({}),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================
// Experiences — Work history entries
// ============================================
export const experiences = pgTable('experiences', {
  id: serial('id').primaryKey(),
  role: varchar('role', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  yearLabel: varchar('year_label', { length: 50 }).notNull(),
  sortOrder: integer('sort_order').default(0),
});

// ============================================
// Projects — Portfolio gallery items
// ============================================
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }),
  overlayText: text('overlay_text'),
  imageUrl: text('image_url').notNull(),
  projectLink: text('project_link'),
  slotNumber: integer('slot_number'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================
// Process Steps — Workflow/process section
// ============================================
export const processSteps = pgTable('process_steps', {
  id: serial('id').primaryKey(),
  stepNumber: varchar('step_number', { length: 10 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  sortOrder: integer('sort_order').default(0),
});

// ============================================
// Services — Pricing / services offered
// ============================================
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  pricePrefix: varchar('price_prefix', { length: 50 }),
  price: varchar('price', { length: 100 }),
  description: text('description'),
});

// ============================================
// Why Choose Me — Pro/Con comparison cards
// ============================================
export const whyChooseMe = pgTable('why_choose_me', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 10 }).notNull(), // 'pro' or 'con'
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
});

// ============================================
// Testimonials — Client reviews & ratings
// ============================================
export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }),
  avatarUrl: text('avatar_url'),
  rating: numeric('rating', { precision: 2, scale: 1 }).default('5.0'),
  review: text('review').notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================
// FAQ Items — Frequently asked questions
// ============================================
export const faqItems = pgTable('faq_items', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  sortOrder: integer('sort_order').default(0),
});

// ============================================
// Messages — Contact form inbox
// ============================================
// RLS: Public INSERT, Auth-only SELECT/UPDATE/DELETE
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  senderName: varchar('sender_name', { length: 255 }).notNull(),
  senderEmail: varchar('sender_email', { length: 255 }).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  statusRead: boolean('status_read').default(false),
});
