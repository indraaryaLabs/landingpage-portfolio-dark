import { supabase } from './supabaseClient';

// ============================================
// Site Settings
// ============================================

export async function getSiteSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data;
}

export async function upsertSiteSettings(settings) {
  // Always target id=1 (single row config)
  const { data: existing } = await supabase
    .from('site_settings')
    .select('id')
    .limit(1)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from('site_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('site_settings')
      .insert(settings)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

// ============================================
// Experiences
// ============================================

export async function getExperiences() {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createExperience(experience) {
  const { data, error } = await supabase
    .from('experiences')
    .insert(experience)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateExperience(id, updates) {
  const { data, error } = await supabase
    .from('experiences')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteExperience(id) {
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ============================================
// Projects
// ============================================

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('slot_number', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createProject(project) {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProject(id, updates) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ============================================
// Process Steps
// ============================================

export async function getProcessSteps() {
  const { data, error } = await supabase
    .from('process_steps')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createProcessStep(step) {
  const { data, error } = await supabase
    .from('process_steps')
    .insert(step)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProcessStep(id, updates) {
  const { data, error } = await supabase
    .from('process_steps')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProcessStep(id) {
  const { error } = await supabase
    .from('process_steps')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ============================================
// Services
// ============================================

export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('id', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createService(service) {
  const { data, error } = await supabase
    .from('services')
    .insert(service)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateService(id, updates) {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteService(id) {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ============================================
// Why Choose Me
// ============================================

export async function getWhyChooseMe() {
  const { data, error } = await supabase
    .from('why_choose_me')
    .select('*')
    .order('id', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createWhyChooseMe(item) {
  const { data, error } = await supabase
    .from('why_choose_me')
    .insert(item)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateWhyChooseMe(id, updates) {
  const { data, error } = await supabase
    .from('why_choose_me')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteWhyChooseMe(id) {
  const { error } = await supabase
    .from('why_choose_me')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ============================================
// Testimonials
// ============================================

export async function getTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createTestimonial(testimonial) {
  const { data, error } = await supabase
    .from('testimonials')
    .insert(testimonial)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTestimonial(id, updates) {
  const { data, error } = await supabase
    .from('testimonials')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTestimonial(id) {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ============================================
// FAQ Items
// ============================================

export async function getFaqItems() {
  const { data, error } = await supabase
    .from('faq_items')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createFaqItem(item) {
  const { data, error } = await supabase
    .from('faq_items')
    .insert(item)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateFaqItem(id, updates) {
  const { data, error } = await supabase
    .from('faq_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteFaqItem(id) {
  const { error } = await supabase
    .from('faq_items')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ============================================
// Messages (Contact Form Inbox)
// ============================================

// Public: anyone can send a message
export async function sendMessage(message) {
  const { data, error } = await supabase
    .from('messages')
    .insert(message)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Admin only: read messages
export async function getMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// Admin only: mark message as read
export async function markMessageRead(id) {
  const { data, error } = await supabase
    .from('messages')
    .update({ status_read: true })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Admin only: delete message
export async function deleteMessage(id) {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// Admin only: get unread count
export async function getUnreadMessageCount() {
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('status_read', false);
  if (error) throw error;
  return count || 0;
}

// ============================================
// Media Upload (Supabase Storage)
// ============================================

const STORAGE_BUCKET = 'portfolio-media';

export async function uploadMedia(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '31536000',
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteMedia(url) {
  // Extract file path from the public URL
  const bucketPath = url.split(`${STORAGE_BUCKET}/`)[1];
  if (!bucketPath) return;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([bucketPath]);

  if (error) throw error;
}
