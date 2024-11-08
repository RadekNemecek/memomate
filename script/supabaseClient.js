import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mqurrtwkehyxwwgffttj.supabase.co'; // Tvoje URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xdXJydHdrZWh5eHd3Z2ZmdHRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMDc1NDUsImV4cCI6MjA0NjU4MzU0NX0.8VAn5R3w80cDC6twRiycsmr1Got9WLcO5ZojyqQRIWU'; // Tvoje API klíč
const supabase = createClient(supabaseUrl, supabaseKey); // Opraveno

export default supabase;
