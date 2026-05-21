// Run SQL migration on Supabase via node
// Usage: node src/lib/migrate.mjs

import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:indraarya771@db.hggwhbhcbgntggddbdmm.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false },
});

const sql = `
-- New columns for site_settings
ALTER TABLE site_settings 
  ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
  ADD COLUMN IF NOT EXISTS about_bio TEXT,
  ADD COLUMN IF NOT EXISTS skills_csv TEXT,
  ADD COLUMN IF NOT EXISTS social_twitter TEXT,
  ADD COLUMN IF NOT EXISTS social_instagram TEXT,
  ADD COLUMN IF NOT EXISTS social_facebook TEXT,
  ADD COLUMN IF NOT EXISTS social_website TEXT,
  ADD COLUMN IF NOT EXISTS hero_comment_1_text TEXT,
  ADD COLUMN IF NOT EXISTS hero_comment_1_author TEXT,
  ADD COLUMN IF NOT EXISTS hero_comment_2_text TEXT,
  ADD COLUMN IF NOT EXISTS hero_comment_2_author TEXT,
  ADD COLUMN IF NOT EXISTS about_badge TEXT,
  ADD COLUMN IF NOT EXISTS about_subhead TEXT,
  ADD COLUMN IF NOT EXISTS about_desc TEXT,
  ADD COLUMN IF NOT EXISTS services_badge TEXT,
  ADD COLUMN IF NOT EXISTS services_title TEXT,
  ADD COLUMN IF NOT EXISTS services_desc TEXT,
  ADD COLUMN IF NOT EXISTS projects_badge TEXT,
  ADD COLUMN IF NOT EXISTS projects_title TEXT,
  ADD COLUMN IF NOT EXISTS projects_desc TEXT,
  ADD COLUMN IF NOT EXISTS why_badge TEXT,
  ADD COLUMN IF NOT EXISTS why_title TEXT,
  ADD COLUMN IF NOT EXISTS why_desc TEXT,
  ADD COLUMN IF NOT EXISTS testimonials_badge TEXT,
  ADD COLUMN IF NOT EXISTS testimonials_title TEXT,
  ADD COLUMN IF NOT EXISTS testimonials_subhead TEXT,
  ADD COLUMN IF NOT EXISTS testimonials_stat_1_val TEXT,
  ADD COLUMN IF NOT EXISTS testimonials_stat_1_lbl TEXT,
  ADD COLUMN IF NOT EXISTS testimonials_stat_2_val TEXT,
  ADD COLUMN IF NOT EXISTS testimonials_stat_2_lbl TEXT,
  ADD COLUMN IF NOT EXISTS testimonials_stat_3_val TEXT,
  ADD COLUMN IF NOT EXISTS testimonials_stat_3_lbl TEXT,
  ADD COLUMN IF NOT EXISTS faq_badge TEXT,
  ADD COLUMN IF NOT EXISTS faq_title TEXT,
  ADD COLUMN IF NOT EXISTS faq_desc TEXT,
  ADD COLUMN IF NOT EXISTS footer_copy TEXT,
  ADD COLUMN IF NOT EXISTS footer_desc TEXT,
  -- Navigation Bar settings
  ADD COLUMN IF NOT EXISTS nav_logo_text TEXT,
  ADD COLUMN IF NOT EXISTS nav_link_1_lbl TEXT,
  ADD COLUMN IF NOT EXISTS nav_link_2_lbl TEXT,
  ADD COLUMN IF NOT EXISTS nav_link_3_lbl TEXT,
  ADD COLUMN IF NOT EXISTS nav_link_4_lbl TEXT,
  ADD COLUMN IF NOT EXISTS nav_btn_lbl TEXT,
  -- Bottom Navigation Bar settings
  ADD COLUMN IF NOT EXISTS footer_link_1_lbl TEXT,
  ADD COLUMN IF NOT EXISTS footer_link_2_lbl TEXT,
  ADD COLUMN IF NOT EXISTS footer_link_3_lbl TEXT,
  ADD COLUMN IF NOT EXISTS footer_link_4_lbl TEXT,
  ADD COLUMN IF NOT EXISTS footer_link_5_lbl TEXT,
  -- Services slider images & resizing settings
  ADD COLUMN IF NOT EXISTS services_fs_images_csv TEXT,
  ADD COLUMN IF NOT EXISTS services_devops_images_csv TEXT,
  ADD COLUMN IF NOT EXISTS services_img_fit TEXT,
  ADD COLUMN IF NOT EXISTS services_img_height TEXT,
  ADD COLUMN IF NOT EXISTS services_img_width TEXT;

-- New columns for projects
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS slot_number INTEGER;

-- New testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  avatar_url TEXT,
  rating DECIMAL(2,1) DEFAULT 5.0,
  review TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- New faq_items table
CREATE TABLE IF NOT EXISTS faq_items (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- RLS for testimonials (public read, auth write)
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Public read testimonials') THEN
    CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Auth insert testimonials') THEN
    CREATE POLICY "Auth insert testimonials" ON testimonials FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Auth update testimonials') THEN
    CREATE POLICY "Auth update testimonials" ON testimonials FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Auth delete testimonials') THEN
    CREATE POLICY "Auth delete testimonials" ON testimonials FOR DELETE USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- RLS for faq_items (public read, auth write)
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'faq_items' AND policyname = 'Public read faq_items') THEN
    CREATE POLICY "Public read faq_items" ON faq_items FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'faq_items' AND policyname = 'Auth insert faq_items') THEN
    CREATE POLICY "Auth insert faq_items" ON faq_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'faq_items' AND policyname = 'Auth update faq_items') THEN
    CREATE POLICY "Auth update faq_items" ON faq_items FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'faq_items' AND policyname = 'Auth delete faq_items') THEN
    CREATE POLICY "Auth delete faq_items" ON faq_items FOR DELETE USING (auth.role() = 'authenticated');
  END IF;
END $$;
`;

async function main() {
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL');
    
    await client.query(sql);
    console.log('✅ Migration completed successfully!');
    
    // Verify
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
    console.log('\\nCurrent tables:', res.rows.map(r => r.table_name).join(', '));
    
    // Check columns in site_settings
    const cols = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'site_settings' ORDER BY ordinal_position");
    console.log('\\nsite_settings columns:', cols.rows.map(r => r.column_name).join(', '));
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await client.end();
  }
}

main();
