// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cfopskauqgpltduhmujq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmb3Bza2F1cWdwbHRkdWhtdWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NTc3ODgsImV4cCI6MjA2NTAzMzc4OH0.9IOk0zbzbiHRv_sNb_ixloMpqxtQdFJ0XcYfCcq2yl8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);