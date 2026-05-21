import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your deployment environment.'
  );
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({}, {
      get: (target, prop) => {
        if (prop === 'auth') {
          return new Proxy({
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            getSession: () => Promise.resolve({ data: { session: null } }),
          }, {
            get: (authTarget, authProp) => {
              if (authProp in authTarget) return authTarget[authProp];
              return () => {
                throw new Error('Supabase authentication is disabled because VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables are missing on Vercel.');
              };
            }
          });
        }
        return () => {
          throw new Error('Supabase client is not initialized because environment variables are missing.');
        };
      }
    });
