// Direct seed script using pg client (no browser needed)
// Run: node src/lib/seed.mjs

import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:indraarya771@db.hggwhbhcbgntggddbdmm.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log('Connected to Supabase PostgreSQL');

  try {
    // 1. Site Settings
    console.log('\n[1/8] Seeding site_settings...');
    await client.query(`DELETE FROM site_settings WHERE id > 0`);
    await client.query(`
      INSERT INTO site_settings (
        badge_text, hero_name, hero_heading, avatar_url, contact_email,
        profile_image_url, about_bio, skills_csv,
        social_twitter, social_instagram, social_facebook, social_website,
        hero_comment_1_text, hero_comment_1_author,
        hero_comment_2_text, hero_comment_2_author,
        about_badge, about_subhead, about_desc,
        services_badge, services_title, services_desc,
        projects_badge, projects_title, projects_desc,
        why_badge, why_title, why_desc,
        testimonials_badge, testimonials_title, testimonials_subhead,
        testimonials_stat_1_val, testimonials_stat_1_lbl,
        testimonials_stat_2_val, testimonials_stat_2_lbl,
        testimonials_stat_3_val, testimonials_stat_3_lbl,
        faq_badge, faq_title, faq_desc,
        footer_copy, footer_desc,
        -- Navigation
        nav_logo_text, nav_link_1_lbl, nav_link_2_lbl, nav_link_3_lbl, nav_link_4_lbl, nav_btn_lbl,
        -- Bottom Navigation
        footer_link_1_lbl, footer_link_2_lbl, footer_link_3_lbl, footer_link_4_lbl, footer_link_5_lbl,
        -- Services images and sizing
        services_fs_images_csv, services_devops_images_csv,
        services_img_fit, services_img_height, services_img_width,
        updated_at
      ) VALUES (
        'Software Engineer',
        'Indra Arya',
        'I engineer high-performance full-stack applications. Bridging robust back-end architecture with intuitive front-end design, supported by a multidisciplinary IT foundation to build reliable digital ecosystems.',
        '',
        'indraarya77.ia@gmail.com',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
        'I am Indra Arya, a dedicated Software Engineer based in Indonesia. My core expertise lies in Full-Stack Development, taking full ownership from database logic to user interfaces. Equipped with multidisciplinary IT capabilities—including AI integration, DevSecOps, and data engineering—I focus on delivering resilient, high-impact systems that drive modern tech operations.',
        'Product Design, UX Design, UI Design, Framer, Branding, Webflow',
        '#',
        'https://www.instagram.com/indraarrya/',
        '#',
        'https://indraarya.vercel.app',
        'Working with him was a game changer!',
        'pranavnb',
        'We Increased our conversions by 200%',
        'vijaynb',
        'Tech Professional',
        'Your Engineer',
        'A brief introduction to my technical expertise and engineering background.',
        'Technical Capabilities',
        'Core Competencies',
        'Deep engineering expertise supported by broad IT operational capabilities.',
        'Recent Projects',
        'Recent Designs',
        'Showcase of some of my recent sleek websites',
        'Why choose me',
        'Why Me as a Tech Partner',
        'Why Partner with Me for Engineering Excellence',
        'Happy Clients',
        'Clients Love me',
        'Successfully delivered 30+ projects with 100% client satisfaction and a 4.9 average rating.',
        '30+',
        'Projects Completed',
        '100%',
        'Client Satisfaction',
        '4.9',
        'Average Rating',
        'FAQ Section',
        'Questions, Answers',
        'Get quick answers to your most pressing questions',
        '© 2026 Indra Arya',
        'High-performance software engineer based in Indonesia, specializing in full-stack development, devops, and security.',
        -- Navigation
        'Indra Arya', 'Profile', 'Services', 'Projects', 'Contact', 'Collaborate',
        -- Bottom Navigation
        'Profile', 'Services', 'Projects', 'Reviews', 'Contact',
        -- Services images and sizing
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop,https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=400&auto=format&fit=crop,https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=400&auto=format&fit=crop,https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop,https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?q=80&w=400&auto=format&fit=crop,https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=400&auto=format&fit=crop,https://images.unsplash.com/photo-1614854262318-831574f15f1f?q=80&w=400&auto=format&fit=crop',
        'cover', '150', '220',
        NOW()
      )
    `);
    console.log('  ✅ site_settings OK');

    // 2. Experiences
    console.log('[2/8] Seeding experiences...');
    await client.query(`DELETE FROM experiences WHERE id > 0`);
    await client.query(`
      INSERT INTO experiences (role, company, year_label, sort_order) VALUES
      ('Freelance', 'GreenLeaf Co', '2021', 0),
      ('UX/UI Designer', 'UrbanFit Studio', '2022', 1),
      ('Product Designer', 'PixelCraft Studios', '2023', 2),
      ('Graphic Designer', 'VistaWorks', '2024', 3)
    `);
    console.log('  ✅ experiences OK (4 items)');

    // 3. Projects
    console.log('[3/8] Seeding projects...');
    await client.query(`DELETE FROM projects WHERE id > 0`);
    await client.query(`
      INSERT INTO projects (title, category, image_url, overlay_text, project_link, slot_number) VALUES
      ('Fade Template', 'Web Design', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop', '', '', 1),
      ('One Day We Met', 'Branding', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', '', '', 2),
      ('AtomAI Platform', 'Product Design', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop', '', '', 3),
      ('Noir Portfolio', 'UI/UX Design', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', '', '', 4)
    `);
    console.log('  ✅ projects OK (4 items)');

    // 4. Process Steps
    console.log('[4/8] Seeding process_steps...');
    await client.query(`DELETE FROM process_steps WHERE id > 0`);
    await client.query(`
      INSERT INTO process_steps (step_number, title, description, sort_order) VALUES
      ('1', 'Context & Planning', 'Analyzing business requirements and evaluating system constraints to map out a scalable software architecture.', 0),
      ('2', 'Prototyping & Design', 'Drafting the technical blueprint, structuring relational database schemas, and designing high-fidelity UI logic.', 1),
      ('3', 'Agile Execution', 'Writing clean, maintainable code across the stack, leveraging modern frameworks and AI-assisted workflows.', 2),
      ('4', 'QA & Deployment', 'Conducting rigorous quality assurance testing, deploying to secure servers, and monitoring system stability.', 3)
    `);
    console.log('  ✅ process_steps OK (4 items)');

    // 5. Services (Footer)
    console.log('[5/8] Seeding services...');
    await client.query(`DELETE FROM services WHERE id > 0`);
    await client.query(`
      INSERT INTO services (title, price_prefix, price, description) VALUES
      ('Full-Stack Development', '', '', 'Architecting scalable web and desktop applications tailored for business impact.'),
      ('IT & System Operations', '', '', 'Providing reliable infrastructure, QA testing, and maintenance to elevate technical operations.')
    `);
    console.log('  ✅ services OK (2 items)');

    // 6. Why Choose Me
    console.log('[6/8] Seeding why_choose_me...');
    await client.query(`DELETE FROM why_choose_me WHERE id > 0`);
    await client.query(`
      INSERT INTO why_choose_me (type, title, description) VALUES
      ('pro', 'Holistic Problem Solving', 'My cross-domain knowledge allows me to anticipate deployment issues and optimize code for scalable environments.'),
      ('con', 'Code-Only Approach', 'Writing code without understanding infrastructure or data architecture often leads to critical integration failures.'),
      ('pro', 'Seamless Team Integration', 'I communicate effectively with UI designers, back-end engineers, QA testers, and System Administrators.'),
      ('con', 'Detached Communication', 'Lack of collaboration and technical empathy results in misaligned outcomes and delayed deliveries.'),
      ('pro', 'End-to-End Accountability', 'From the first line of code to the final QA audit, I ensure every layer meets rigorous enterprise standards.'),
      ('con', 'Unreliable Deployments', 'Inconsistent workflows and untested server deployments compromise the quality and security of the system.')
    `);
    console.log('  ✅ why_choose_me OK (6 items)');

    // 7. Testimonials
    console.log('[7/8] Seeding testimonials...');
    await client.query(`DELETE FROM testimonials WHERE id > 0`);
    await client.query(`
      INSERT INTO testimonials (name, role, avatar_url, rating, review, sort_order) VALUES
      ('Will Smith', 'Harper Education', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop', 5.0, 'The designs exceeded our expectations! Every element felt purposeful, creating a seamless and visually stunning brand identity', 0),
      ('Ikta Sollork', 'PARAL CEO', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop', 5.0, 'Working with this process was effortless. The vision was understood perfectly, and the designs truly represent my brand', 1),
      ('Liloch', 'AIO Founder', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop', 5.0, 'Exceptional creativity and attention to detail! The final product not only looks great but also enhances user engagement', 2),
      ('Diane Swag', 'Swag Studio', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop', 5.0, 'A game-changing experience! The design process was smooth, collaborative, and resulted in a brand presence we''re proud of', 3)
    `);
    console.log('  ✅ testimonials OK (4 items)');

    // 8. FAQ Items
    console.log('[8/8] Seeding faq_items...');
    await client.query(`DELETE FROM faq_items WHERE id > 0`);
    await client.query(`
      INSERT INTO faq_items (question, answer, sort_order) VALUES
      ('What is your core tech stack?', 'I specialize in modern frameworks including React, Tailwind CSS, Node.js, Python, PostgreSQL, and Supabase, utilizing tools like Google Antigravity to accelerate development.', 0),
      ('Can you handle both front-end and back-end?', 'Yes, I provide end-to-end full-stack development, ensuring seamless integration between the database infrastructure and user interface.', 1),
      ('Do you work with AI or Cloud systems?', 'Absolutely. I integrate AI workflows into applications and configure robust cloud architectures to ensure the systems are scalable and future-proof.', 2)
    `);
    console.log('  ✅ faq_items OK (3 items)');

    console.log('\n🎉 All data seeded successfully!');

    // Summary
    const counts = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM site_settings) as settings,
        (SELECT COUNT(*) FROM experiences) as experiences,
        (SELECT COUNT(*) FROM projects) as projects,
        (SELECT COUNT(*) FROM process_steps) as steps,
        (SELECT COUNT(*) FROM services) as services,
        (SELECT COUNT(*) FROM why_choose_me) as why_me,
        (SELECT COUNT(*) FROM testimonials) as testimonials,
        (SELECT COUNT(*) FROM faq_items) as faq
    `);
    console.log('\nDatabase summary:', counts.rows[0]);

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await client.end();
  }
}

main();
