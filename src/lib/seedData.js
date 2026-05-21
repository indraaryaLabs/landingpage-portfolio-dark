/**
 * Seed script to populate all CMS tables with the current hardcoded website data.
 * Run this from the browser console while logged into /admin.
 * 
 * Usage: Import and call seedAllData() from any admin component, 
 *        or paste the generated SQL into Supabase SQL Editor.
 */
import { supabase } from './supabaseClient';

export async function seedAllData() {
  const results = {};

  // ============================================
  // 1. Site Settings
  // ============================================
  try {
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1)
      .single();

    const settingsPayload = {
      badge_text: 'Software Engineer',
      hero_name: 'Indra Arya',
      hero_heading: "I engineer high-performance full-stack applications. Bridging robust back-end architecture with intuitive front-end design, supported by a multidisciplinary IT foundation to build reliable digital ecosystems.",
      avatar_url: '',
      contact_email: 'indraarya77.ia@gmail.com',
      profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      about_bio: "I am Indra Arya, a dedicated Software Engineer based in Indonesia. My core expertise lies in Full-Stack Development, taking full ownership from database logic to user interfaces. Equipped with multidisciplinary IT capabilities—including AI integration, DevSecOps, and data engineering—I focus on delivering resilient, high-impact systems that drive modern tech operations.",
      skills_csv: 'Product Design, UX Design, UI Design, Framer, Branding, Webflow',
      social_twitter: '#',
      social_instagram: 'https://www.instagram.com/indraarrya/',
      social_facebook: '#',
      social_website: 'https://indraarya.vercel.app',
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      const { error } = await supabase.from('site_settings').update(settingsPayload).eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('site_settings').insert(settingsPayload);
      if (error) throw error;
    }
    results.settings = 'OK';
  } catch (e) {
    results.settings = 'ERROR: ' + e.message;
  }

  // ============================================
  // 2. Experiences
  // ============================================
  try {
    // Clear existing
    await supabase.from('experiences').delete().neq('id', 0);
    const { error } = await supabase.from('experiences').insert([
      { role: 'Freelance', company: 'GreenLeaf Co', year_label: '2021', sort_order: 0 },
      { role: 'UX/UI Designer', company: 'UrbanFit Studio', year_label: '2022', sort_order: 1 },
      { role: 'Product Designer', company: 'PixelCraft Studios', year_label: '2023', sort_order: 2 },
      { role: 'Graphic Designer', company: 'VistaWorks', year_label: '2024', sort_order: 3 },
    ]);
    if (error) throw error;
    results.experiences = 'OK (4 items)';
  } catch (e) {
    results.experiences = 'ERROR: ' + e.message;
  }

  // ============================================
  // 3. Projects
  // ============================================
  try {
    await supabase.from('projects').delete().neq('id', 0);
    const { error } = await supabase.from('projects').insert([
      { title: 'Fade Template', category: 'Web Design', image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop', overlay_text: '', project_link: '' },
      { title: 'One Day We Met', category: 'Branding', image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', overlay_text: '', project_link: '' },
      { title: 'AtomAI Platform', category: 'Product Design', image_url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop', overlay_text: '', project_link: '' },
      { title: 'Noir Portfolio', category: 'UI/UX Design', image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', overlay_text: '', project_link: '' },
    ]);
    if (error) throw error;
    results.projects = 'OK (4 items)';
  } catch (e) {
    results.projects = 'ERROR: ' + e.message;
  }

  // ============================================
  // 4. Process Steps
  // ============================================
  try {
    await supabase.from('process_steps').delete().neq('id', 0);
    const { error } = await supabase.from('process_steps').insert([
      { step_number: '1', title: 'Context & Planning', description: 'Analyzing business requirements and evaluating system constraints to map out a scalable software architecture.', sort_order: 0 },
      { step_number: '2', title: 'Prototyping & Design', description: 'Drafting the technical blueprint, structuring relational database schemas, and designing high-fidelity UI logic.', sort_order: 1 },
      { step_number: '3', title: 'Agile Execution', description: 'Writing clean, maintainable code across the stack, leveraging modern frameworks and AI-assisted workflows.', sort_order: 2 },
      { step_number: '4', title: 'QA & Deployment', description: 'Conducting rigorous quality assurance testing, deploying to secure servers, and monitoring system stability.', sort_order: 3 },
    ]);
    if (error) throw error;
    results.processSteps = 'OK (4 items)';
  } catch (e) {
    results.processSteps = 'ERROR: ' + e.message;
  }

  // ============================================
  // 5. Services (Footer pricing list)
  // ============================================
  try {
    await supabase.from('services').delete().neq('id', 0);
    const { error } = await supabase.from('services').insert([
      { title: 'Full-Stack Development', price_prefix: '', price: '', description: 'Architecting scalable web and desktop applications tailored for business impact.' },
      { title: 'IT & System Operations', price_prefix: '', price: '', description: 'Providing reliable infrastructure, QA testing, and maintenance to elevate technical operations.' },
    ]);
    if (error) throw error;
    results.services = 'OK (2 items)';
  } catch (e) {
    results.services = 'ERROR: ' + e.message;
  }

  // ============================================
  // 6. Why Choose Me
  // ============================================
  try {
    await supabase.from('why_choose_me').delete().neq('id', 0);
    const { error } = await supabase.from('why_choose_me').insert([
      { type: 'pro', title: 'Holistic Problem Solving', description: 'My cross-domain knowledge allows me to anticipate deployment issues and optimize code for scalable environments.' },
      { type: 'con', title: 'Code-Only Approach', description: 'Writing code without understanding infrastructure or data architecture often leads to critical integration failures.' },
      { type: 'pro', title: 'Seamless Team Integration', description: 'I communicate effectively with UI designers, back-end engineers, QA testers, and System Administrators.' },
      { type: 'con', title: 'Detached Communication', description: 'Lack of collaboration and technical empathy results in misaligned outcomes and delayed deliveries.' },
      { type: 'pro', title: 'End-to-End Accountability', description: 'From the first line of code to the final QA audit, I ensure every layer meets rigorous enterprise standards.' },
      { type: 'con', title: 'Unreliable Deployments', description: 'Inconsistent workflows and untested server deployments compromise the quality and security of the system.' },
    ]);
    if (error) throw error;
    results.whyChooseMe = 'OK (6 items)';
  } catch (e) {
    results.whyChooseMe = 'ERROR: ' + e.message;
  }

  // ============================================
  // 7. Testimonials
  // ============================================
  try {
    await supabase.from('testimonials').delete().neq('id', 0);
    const { error } = await supabase.from('testimonials').insert([
      { name: 'Will Smith', role: 'Harper Education', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop', rating: 5.0, review: 'The designs exceeded our expectations! Every element felt purposeful, creating a seamless and visually stunning brand identity', sort_order: 0 },
      { name: 'Ikta Sollork', role: 'PARAL CEO', avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop', rating: 5.0, review: 'Working with this process was effortless. The vision was understood perfectly, and the designs truly represent my brand', sort_order: 1 },
      { name: 'Liloch', role: 'AIO Founder', avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop', rating: 5.0, review: 'Exceptional creativity and attention to detail! The final product not only looks great but also enhances user engagement', sort_order: 2 },
      { name: 'Diane Swag', role: 'Swag Studio', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop', rating: 5.0, review: "A game-changing experience! The design process was smooth, collaborative, and resulted in a brand presence we're proud of", sort_order: 3 },
    ]);
    if (error) throw error;
    results.testimonials = 'OK (4 items)';
  } catch (e) {
    results.testimonials = 'ERROR: ' + e.message;
  }

  // ============================================
  // 8. FAQ Items
  // ============================================
  try {
    await supabase.from('faq_items').delete().neq('id', 0);
    const { error } = await supabase.from('faq_items').insert([
      { question: 'What is your core tech stack?', answer: 'I specialize in modern frameworks including React, Tailwind CSS, Node.js, Python, PostgreSQL, and Supabase, utilizing tools like Google Antigravity to accelerate development.', sort_order: 0 },
      { question: 'Can you handle both front-end and back-end?', answer: 'Yes, I provide end-to-end full-stack development, ensuring seamless integration between the database infrastructure and user interface.', sort_order: 1 },
      { question: 'Do you work with AI or Cloud systems?', answer: 'Absolutely. I integrate AI workflows into applications and configure robust cloud architectures to ensure the systems are scalable and future-proof.', sort_order: 2 },
    ]);
    if (error) throw error;
    results.faqItems = 'OK (3 items)';
  } catch (e) {
    results.faqItems = 'ERROR: ' + e.message;
  }

  return results;
}
