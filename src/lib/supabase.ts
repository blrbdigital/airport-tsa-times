import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://axixhkgmsxuxpnbdbvzu.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4aXhoa2dtc3h1eHBuYmRidnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NDcwNjQsImV4cCI6MjA5MDIyMzA2NH0.QdtHHTr7Kj3Cx2FnAfHvghmOtCg1h3EFJBrxlcSVkYI';

export const supabase = createClient(supabaseUrl, supabaseKey);
