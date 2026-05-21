import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Generic hook for fetching data from a Supabase table.
 *
 * @param {string} table - Table name (e.g. 'projects')
 * @param {object} options
 * @param {string} [options.select='*'] - Columns to select
 * @param {string} [options.orderBy] - Column to order by (snake_case)
 * @param {boolean} [options.ascending=true] - Sort direction
 * @param {object} [options.filters] - Key-value pairs for .eq() filters
 * @param {boolean} [options.single=false] - Expect single row (.single())
 * @param {boolean} [options.enabled=true] - Set false to skip fetch
 * @returns {{ data, loading, error, refetch }}
 *
 * @example
 * const { data: projects, loading } = useSupabaseQuery('projects', {
 *   orderBy: 'created_at',
 *   ascending: false,
 * });
 *
 * @example
 * const { data: settings } = useSupabaseQuery('site_settings', {
 *   single: true,
 * });
 */
export function useSupabaseQuery(table, options = {}) {
  const {
    select = '*',
    orderBy,
    ascending = true,
    filters,
    single = false,
    enabled = true,
  } = options;

  const [data, setData] = useState(single ? null : []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stabilize filters to avoid infinite re-render loops
  const filtersKey = filters ? JSON.stringify(filters) : '';

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase.from(table).select(select);

      // Apply equality filters
      if (filters) {
        Object.entries(filters).forEach(([column, value]) => {
          query = query.eq(column, value);
        });
      }

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy, { ascending });
      }

      // Single row mode
      if (single) {
        query = query.limit(1).single();
      }

      const { data: result, error: queryError } = await query;

      if (queryError) {
        // PGRST116 = no rows found for .single() — not a real error
        if (queryError.code === 'PGRST116') {
          setData(null);
        } else {
          throw queryError;
        }
      } else {
        setData(result);
      }
    } catch (err) {
      console.error(`[useSupabaseQuery] Error fetching "${table}":`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [table, select, orderBy, ascending, filtersKey, single, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
