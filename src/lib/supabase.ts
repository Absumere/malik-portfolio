import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  video_url?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export async function getPortfolioItems() {
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as PortfolioItem[];
}

export async function getPortfolioItem(id: number) {
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as PortfolioItem;
}
