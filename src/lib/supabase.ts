import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oxbyfvwkyrpesmnjfixx.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94YnlmdndreXJwZXNtbmpmaXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MzM2NzcsImV4cCI6MjA5MDEwOTY3N30.k6raNTKTnojAVWbXXy8JO9U495XbVZ59WwvdiHt2ACA';

export const supabase = createClient(supabaseUrl, supabaseKey);
