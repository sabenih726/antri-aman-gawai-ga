
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ServiceType = Database['public']['Tables']['service_types']['Row'];
type Counter = Database['public']['Tables']['counters']['Row'];
type QueueTicket = Database['public']['Tables']['queue_tickets']['Row'];

export const useSupabaseQueue = () => {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [queue, setQueue] = useState<QueueTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesRes, countersRes, queueRes] = await Promise.all([
        supabase.from('service_types').select('*').order('name'),
        supabase.from('counters').select('*').order('id'),
        supabase.from('queue_tickets').select('*').order('created_at', { ascending: false })
      ]);

      if (servicesRes.error) throw servicesRes.error;
      if (countersRes.error) throw countersRes.error;
      if (queueRes.error) throw queueRes.error;

      setServices(servicesRes.data || []);
      setCounters(countersRes.data || []);
      setQueue(queueRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    fetchData();

    // Subscribe to service_types changes
    const servicesChannel = supabase
      .channel('service_types_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_types'
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    // Subscribe to counters changes
    const countersChannel = supabase
      .channel('counters_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'counters'
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    // Subscribe to queue_tickets changes
    const queueChannel = supabase
      .channel('queue_tickets_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queue_tickets'
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(servicesChannel);
      supabase.removeChannel(countersChannel);
      supabase.removeChannel(queueChannel);
    };
  }, []);

  return {
    services,
    counters,
    queue,
    loading,
    error,
    refetch: fetchData
  };
};
