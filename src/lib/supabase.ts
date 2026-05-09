import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Try to get environment variables from Vite (injected by vite.config.ts define option)
  // Also try window object in case injected there
  const supabaseUrl = (
    (import.meta.env.VITE_SUPABASE_URL as string) ||
    (globalThis as any).VITE_SUPABASE_URL ||
    (globalThis as any).__SUPABASE_URL
  );
  
  const supabaseAnonKey = (
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
    (globalThis as any).VITE_SUPABASE_ANON_KEY ||
    (globalThis as any).__SUPABASE_ANON_KEY
  );

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[v0] Supabase initialization failed', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      importMetaEnv: Object.keys(import.meta.env).filter(k => k.includes('SUPABASE')),
    });
    throw new Error(
      'Missing Supabase credentials. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    );
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getSupabaseClient();
    return (client as any)[prop];
  },
});

// Types for processes
export interface ProcessRecord {
  id: string;
  created_at: string;
  updated_at: string;
  material_name: string;
  material_dimensions: string;
  quantity: number;
  scheduled_start_time: string;
  scheduled_end_time: string;
  strategy_type: 'cheapest' | 'fastest' | 'greenest';
  cement: number;
  slag: number;
  fly_ash: number;
  water: number;
  superplasticizer: number;
  coarse: number;
  fine: number;
  age: number;
  curing_method: string;
  chambers: number;
  mould: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

// Fetch all processes
export async function getProcesses() {
  const { data, error } = await supabase
    .from('processes')
    .select('*')
    .order('scheduled_start_time', { ascending: true });

  if (error) {
    console.error('[v0] Error fetching processes:', error);
    return [];
  }

  return data as ProcessRecord[];
}

// Add new process
export async function createProcess(process: Omit<ProcessRecord, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('processes')
    .insert([process])
    .select()
    .single();

  if (error) {
    console.error('[v0] Error creating process:', error);
    throw error;
  }

  return data as ProcessRecord;
}

// Check for timeline conflicts
export async function checkTimelineConflict(
  scheduledStartTime: string,
  scheduledEndTime: string,
  excludeId?: string
) {
  const { data, error } = await supabase
    .from('processes')
    .select('*')
    .gte('scheduled_end_time', scheduledStartTime)
    .lte('scheduled_start_time', scheduledEndTime)
    .neq('status', 'cancelled');

  if (error) {
    console.error('[v0] Error checking conflicts:', error);
    return [];
  }

  const conflicts = (data as ProcessRecord[]).filter(p => 
    !excludeId || p.id !== excludeId
  );

  return conflicts;
}

// Update process
export async function updateProcess(id: string, updates: Partial<ProcessRecord>) {
  const { data, error } = await supabase
    .from('processes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[v0] Error updating process:', error);
    throw error;
  }

  return data as ProcessRecord;
}

// Delete process
export async function deleteProcess(id: string) {
  const { error } = await supabase
    .from('processes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[v0] Error deleting process:', error);
    throw error;
  }
}
