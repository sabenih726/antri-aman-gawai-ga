
import React, { createContext, useContext, useState } from "react";
import { useSupabaseQueue } from "@/hooks/useSupabaseQueue";
import { queueService } from "@/services/queueService";
import type { Database } from "@/integrations/supabase/types";

type ServiceType = Database['public']['Tables']['service_types']['Row'];
type Counter = Database['public']['Tables']['counters']['Row'];
type QueueTicket = Database['public']['Tables']['queue_tickets']['Row'];

type SupabaseQueueContextType = {
  services: ServiceType[];
  counters: Counter[];
  queue: QueueTicket[];
  loading: boolean;
  error: string | null;
  addToQueue: (serviceTypeId: string, customerName?: string, purpose?: string, priority?: "normal" | "urgent" | "vip") => Promise<string>;
  callNext: (counterId: number, serviceTypeId: string) => Promise<QueueTicket | null>;
  completeService: (ticketId: string, notes?: string) => Promise<void>;
  setCounterStatus: (counterId: number, status: "active" | "inactive") => Promise<void>;
  setCounterService: (counterId: number, serviceTypeId: string | null) => Promise<void>;
  getWaitingCount: (serviceTypeId: string) => number;
  getTicketPosition: (ticketId: string) => number | null;
  getAllWaitingTickets: () => QueueTicket[];
  getServiceByPrefix: (prefix: string) => ServiceType | undefined;
  clearAllData: () => Promise<void>;
  getTicketById: (ticketId: string) => QueueTicket | undefined;
  updateTicket: (ticketId: string, updates: Partial<QueueTicket>) => Promise<void>;
  getEstimatedWaitTime: (serviceTypeId: string) => number;
  refetch: () => Promise<void>;
};

const SupabaseQueueContext = createContext<SupabaseQueueContextType | undefined>(undefined);

export const useSupabaseQueueContext = () => {
  const context = useContext(SupabaseQueueContext);
  if (!context) {
    throw new Error("useSupabaseQueueContext must be used within a SupabaseQueueProvider");
  }
  return context;
};

export const SupabaseQueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { services, counters, queue, loading, error, refetch } = useSupabaseQueue();

  const addToQueue = async (
    serviceTypeId: string, 
    customerName?: string, 
    purpose?: string, 
    priority: "normal" | "urgent" | "vip" = "normal"
  ): Promise<string> => {
    const service = services.find(s => s.id === serviceTypeId);
    if (!service) throw new Error("Service not found");

    const newNumber = service.current_number + 1;
    const ticketNumber = `${service.prefix}${newNumber.toString().padStart(3, '0')}`;
    
    const waitingCount = getWaitingCount(serviceTypeId);
    const avgServiceTime = 5;
    const estimatedWait = waitingCount * avgServiceTime;
    
    const ticket = await queueService.createTicket({
      number: ticketNumber,
      service_type_id: serviceTypeId,
      customer_name: customerName,
      purpose,
      priority,
      estimated_wait_time: estimatedWait,
    });
    
    await queueService.updateServiceNumber(serviceTypeId, newNumber);
    
    return ticket.number;
  };

  const callNext = async (counterId: number, serviceTypeId: string): Promise<QueueTicket | null> => {
    const waitingTickets = await queueService.getWaitingTickets(serviceTypeId);
    const nextTicket = waitingTickets[0];
    
    if (!nextTicket) return null;
    
    await queueService.updateTicket(nextTicket.id, {
      status: 'serving',
      counter_assigned: counterId,
      called_at: new Date().toISOString()
    });
    
    await queueService.updateCounter(counterId, {
      currently_serving: nextTicket.number
    });
    
    const service = services.find(s => s.id === serviceTypeId);
    if (service) {
      await queueService.updateServiceServed(serviceTypeId, service.served + 1);
    }
    
    return nextTicket;
  };

  const completeService = async (ticketId: string, notes?: string) => {
    const ticket = queue.find(t => t.id === ticketId);
    if (!ticket || ticket.status !== "serving") return;

    await queueService.updateTicket(ticketId, {
      status: 'completed',
      completed_at: new Date().toISOString(),
      notes
    });

    if (ticket.counter_assigned) {
      await queueService.updateCounter(ticket.counter_assigned, {
        currently_serving: null
      });
    }
  };

  const setCounterStatus = async (counterId: number, status: "active" | "inactive") => {
    await queueService.updateCounter(counterId, { status });
  };

  const setCounterService = async (counterId: number, serviceTypeId: string | null) => {
    await queueService.updateCounter(counterId, { service_type_id: serviceTypeId });
  };

  const getWaitingCount = (serviceTypeId: string): number => {
    return queue.filter(
      ticket => ticket.service_type_id === serviceTypeId && ticket.status === "waiting"
    ).length;
  };

  const getTicketPosition = (ticketId: string): number | null => {
    const ticket = queue.find(t => t.id === ticketId);
    if (!ticket || ticket.status !== "waiting") return null;
    
    const waitingTickets = queue.filter(
      t => t.service_type_id === ticket.service_type_id && t.status === "waiting"
    ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    return waitingTickets.findIndex(t => t.id === ticketId) + 1;
  };

  const getAllWaitingTickets = (): QueueTicket[] => {
    return queue.filter(ticket => ticket.status === "waiting")
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  };

  const getServiceByPrefix = (prefix: string): ServiceType | undefined => {
    return services.find(service => service.prefix === prefix);
  };

  const getTicketById = (ticketId: string): QueueTicket | undefined => {
    return queue.find(ticket => ticket.id === ticketId);
  };

  const updateTicket = async (ticketId: string, updates: Partial<QueueTicket>) => {
    await queueService.updateTicket(ticketId, updates);
  };

  const getEstimatedWaitTime = (serviceTypeId: string): number => {
    const waitingCount = getWaitingCount(serviceTypeId);
    const avgServiceTime = 5;
    return waitingCount * avgServiceTime;
  };

  const clearAllData = async () => {
    await queueService.resetAllData();
  };

  const value = {
    services,
    counters,
    queue,
    loading,
    error,
    addToQueue,
    callNext,
    completeService,
    setCounterStatus,
    setCounterService,
    getWaitingCount,
    getTicketPosition,
    getAllWaitingTickets,
    getServiceByPrefix,
    clearAllData,
    getTicketById,
    updateTicket,
    getEstimatedWaitTime,
    refetch
  };

  return <SupabaseQueueContext.Provider value={value}>{children}</SupabaseQueueContext.Provider>;
};
