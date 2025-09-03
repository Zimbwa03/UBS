import { createClient } from '@supabase/supabase-js';

// Supabase configuration
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sqbnzpwxbzlmjbqsclia.supabase.co';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxYm56cHd4YnpsbWpicXNjbGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4OTkzMDMsImV4cCI6MjA3MjQ3NTMwM30.9nn_-l1kjRZqHtl9iIFCaxUbnBxhLAXbL0jvE6vsW3Y';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
