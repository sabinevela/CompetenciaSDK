import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rnpcwcsxbosgpbmtneph.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucGN3Y3N4Ym9zZ3BibXRuZXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4ODkwNzksImV4cCI6MjA3ODQ2NTA3OX0.Sr7USII37JDZq9Nyqk8O_OXl809K7taZicquBp0-lyQ';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);