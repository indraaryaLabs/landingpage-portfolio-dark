import { useState, useEffect } from 'react';
import {
  getSiteSettings,
  getExperiences,
  getProjects,
  getProcessSteps,
  getServices,
  getWhyChooseMe,
  getTestimonials,
  getFaqItems,
} from '../lib/supabaseApi';

/**
 * Aggregator hook that fetches ALL public site data in parallel.
 * Used by the Home page to load everything needed for render.
 * Includes a timeout to prevent infinite loading if Supabase is unreachable.
 */
export function useSiteData() {
  const [data, setData] = useState({
    settings: null,
    experiences: [],
    projects: [],
    processSteps: [],
    services: [],
    whyChooseMe: [],
    testimonials: [],
    faqItems: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchAll() {
    setLoading(true);
    setError(null);

    try {
      // Add a 5-second timeout so the page renders even if Supabase is down
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Supabase request timeout')), 5000)
      );

      const fetchPromise = Promise.all([
        getSiteSettings().catch(() => null),
        getExperiences().catch(() => []),
        getProjects().catch(() => []),
        getProcessSteps().catch(() => []),
        getServices().catch(() => []),
        getWhyChooseMe().catch(() => []),
        getTestimonials().catch(() => []),
        getFaqItems().catch(() => []),
      ]);

      const [
        settings,
        experiences,
        projects,
        processSteps,
        services,
        whyChooseMe,
        testimonials,
        faqItems,
      ] = await Promise.race([fetchPromise, timeout.then(() => [null, [], [], [], [], [], [], []])]);

      setData({
        settings: settings || null,
        experiences: experiences || [],
        projects: projects || [],
        processSteps: processSteps || [],
        services: services || [],
        whyChooseMe: whyChooseMe || [],
        testimonials: testimonials || [],
        faqItems: faqItems || [],
      });
    } catch (err) {
      console.warn('[useSiteData] Supabase unavailable, using fallback data:', err.message);
      setError(err.message || 'Failed to load site data');
      // Still set loading to false so fallback data renders
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    ...data,
    loading,
    error,
    refetch: fetchAll,
  };
}
