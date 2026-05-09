import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
