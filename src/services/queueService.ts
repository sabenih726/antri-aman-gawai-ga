
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ServiceTypeInsert = Database['public']['Tables']['service_types']['Insert'];
type CounterUpdate = Database['public']['Tables']['counters']['Update'];
type QueueTicketInsert = Database['public']['Tables']['queue_tickets']['Insert'];
type QueueTicketUpdate = Database['public']['Tables']['queue_tickets']['Update'];

export const queueService = {
  // Service operations
  async getServices() {
    const { data, error } = await supabase
      .from('service_types')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async updateServiceNumber(serviceId: string, currentNumber: number) {
    const { error } = await supabase
      .from('service_types')
      .update({ current_number: currentNumber })
      .eq('id', serviceId);
    
    if (error) throw error;
  },

  async updateServiceServed(serviceId: string, served: number) {
    const { error } = await supabase
      .from('service_types')
      .update({ served })
      .eq('id', serviceId);
    
    if (error) throw error;
  },

  // Counter operations
  async getCounters() {
    const { data, error } = await supabase
      .from('counters')
      .select('*')
      .order('id');
    
    if (error) throw error;
    return data;
  },

  async updateCounter(counterId: number, updates: CounterUpdate) {
    const { error } = await supabase
      .from('counters')
      .update(updates)
      .eq('id', counterId);
    
    if (error) throw error;
  },

  // Queue ticket operations
  async getQueueTickets() {
    const { data, error } = await supabase
      .from('queue_tickets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createTicket(ticket: QueueTicketInsert) {
    const { data, error } = await supabase
      .from('queue_tickets')
      .insert(ticket)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateTicket(ticketId: string, updates: QueueTicketUpdate) {
    const { error } = await supabase
      .from('queue_tickets')
      .update(updates)
      .eq('id', ticketId);
    
    if (error) throw error;
  },

  async getTicketById(ticketId: string) {
    const { data, error } = await supabase
      .from('queue_tickets')
      .select('*')
      .eq('id', ticketId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getWaitingTickets(serviceTypeId?: string) {
    let query = supabase
      .from('queue_tickets')
      .select('*')
      .eq('status', 'waiting')
      .order('created_at', { ascending: true });

    if (serviceTypeId) {
      query = query.eq('service_type_id', serviceTypeId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Reset all data
  async resetAllData() {
    // Delete all tickets
    await supabase.from('queue_tickets').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Reset service numbers
    await supabase
      .from('service_types')
      .update({ current_number: 0, served: 0 })
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Reset counters
    await supabase
      .from('counters')
      .update({ currently_serving: null, service_type_id: null })
      .neq('id', 0);
  }
};
