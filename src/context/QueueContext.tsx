
import React, { createContext, useContext, useState, useEffect } from "react";

// Service types
export type ServiceType = {
  id: string;
  name: string;
  prefix: string;
  currentNumber: number;
  served: number;
  waiting: number;
  averageWaitTime?: number; // Waktu tunggu rata-rata dalam menit
};

// Counter status
export type Counter = {
  id: number;
  name: string;
  status: "active" | "inactive";
  currentlyServing: string | null;
  serviceType: string | null;
};

// Queue ticket
export type QueueTicket = {
  id: string;
  number: string;
  serviceType: string;
  status: "waiting" | "serving" | "completed";
  timestamp: Date;
  counterAssigned?: number;
  completedTimestamp?: Date;
};

type QueueContextType = {
  services: ServiceType[];
  counters: Counter[];
  queue: QueueTicket[];
  addToQueue: (serviceType: string) => string;
  callNext: (counterId: number, serviceType: string) => QueueTicket | null;
  completeService: (ticketId: string) => void;
  setCounterStatus: (counterId: number, status: "active" | "inactive") => void;
  setCounterService: (counterId: number, serviceType: string | null) => void;
  getWaitingCount: (serviceType: string) => number;
  getTicketPosition: (ticketId: string) => number | null;
  getAllWaitingTickets: () => QueueTicket[];
  getServiceByPrefix: (prefix: string) => ServiceType | undefined;
  getLastTicket: () => QueueTicket | null;
};

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("useQueue must be used within a QueueProvider");
  }
  return context;
};

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial services
  const [services, setServices] = useState<ServiceType[]>([
    { 
      id: "general", 
      name: "Pelayanan Umum", 
      prefix: "A", 
      currentNumber: 0, 
      served: 0, 
      waiting: 0,
      averageWaitTime: 5 
    },
    { 
      id: "facility", 
      name: "Fasilitas", 
      prefix: "D", 
      currentNumber: 0, 
      served: 0, 
      waiting: 0,
      averageWaitTime: 8 
    },
  ]);

  // Initial counters
  const [counters, setCounters] = useState<Counter[]>([
    { id: 1, name: "Counter 1", status: "active", currentlyServing: null, serviceType: null },
    { id: 2, name: "Counter 2", status: "active", currentlyServing: null, serviceType: null },
    { id: 3, name: "Counter 3", status: "inactive", currentlyServing: null, serviceType: null },
    { id: 4, name: "Counter 4", status: "inactive", currentlyServing: null, serviceType: null },
  ]);

  // Queue
  const [queue, setQueue] = useState<QueueTicket[]>([]);

  // Update service waiting counts
  useEffect(() => {
    const updatedServices = services.map(service => {
      const waitingCount = queue.filter(
        ticket => ticket.serviceType === service.id && ticket.status === "waiting"
      ).length;
      
      return { ...service, waiting: waitingCount };
    });
    
    setServices(updatedServices);
  }, [queue]);

  // Add new ticket to queue
  const addToQueue = (serviceType: string): string => {
    const service = services.find(s => s.id === serviceType);
    if (!service) return "";

    const newNumber = service.currentNumber + 1;
    const ticketNumber = `${service.prefix}${newNumber.toString().padStart(3, '0')}`;
    
    // Buat ID yang unik untuk tiket ini
    const ticketId = `${serviceType}-${Date.now()}`;
    
    const newTicket: QueueTicket = {
      id: ticketId,
      number: ticketNumber,
      serviceType: serviceType,
      status: "waiting",
      timestamp: new Date(),
    };
    
    setQueue(prev => [...prev, newTicket]);
    
    // Update the service's current number
    setServices(prev => 
      prev.map(s => s.id === serviceType ? { ...s, currentNumber: newNumber } : s)
    );
    
    return ticketNumber;
  };

  // Call next ticket for counter
  const callNext = (counterId: number, serviceType: string): QueueTicket | null => {
    const nextTicket = queue.find(
      ticket => ticket.serviceType === serviceType && ticket.status === "waiting"
    );
    
    if (!nextTicket) return null;
    
    // Update ticket status
    setQueue(prev => 
      prev.map(ticket => 
        ticket.id === nextTicket.id 
          ? { ...ticket, status: "serving", counterAssigned: counterId } 
          : ticket
      )
    );
    
    // Update counter
    setCounters(prev => 
      prev.map(counter => 
        counter.id === counterId 
          ? { ...counter, currentlyServing: nextTicket.number, serviceType: serviceType } 
          : counter
      )
    );
    
    // Update service statistics
    setServices(prev => 
      prev.map(service => 
        service.id === serviceType
          ? { ...service, served: service.served + 1 }
          : service
      )
    );
    
    return nextTicket;
  };

  // Complete current service at counter
  const completeService = (ticketId: string) => {
    const ticket = queue.find(t => t.id === ticketId);
    if (!ticket || ticket.status !== "serving") return;

    // Update ticket
    setQueue(prev => 
      prev.map(t => 
        t.id === ticketId 
          ? { ...t, status: "completed", completedTimestamp: new Date() } 
          : t
      )
    );

    // Update counter
    if (ticket.counterAssigned) {
      setCounters(prev => 
        prev.map(counter => 
          counter.id === ticket.counterAssigned 
            ? { ...counter, currentlyServing: null } 
            : counter
        )
      );
    }
  };

  // Set counter status (active/inactive)
  const setCounterStatus = (counterId: number, status: "active" | "inactive") => {
    setCounters(prev => 
      prev.map(counter => 
        counter.id === counterId ? { ...counter, status } : counter
      )
    );
  };

  // Set counter service type
  const setCounterService = (counterId: number, serviceType: string | null) => {
    setCounters(prev => 
      prev.map(counter => 
        counter.id === counterId ? { ...counter, serviceType } : counter
      )
    );
  };

  // Get waiting count for a service
  const getWaitingCount = (serviceType: string): number => {
    return queue.filter(
      ticket => ticket.serviceType === serviceType && ticket.status === "waiting"
    ).length;
  };

  // Get position in queue
  const getTicketPosition = (ticketId: string): number | null => {
    const ticket = queue.find(t => t.id === ticketId);
    if (!ticket || ticket.status !== "waiting") return null;
    
    const waitingTickets = queue.filter(
      t => t.serviceType === ticket.serviceType && t.status === "waiting"
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    return waitingTickets.findIndex(t => t.id === ticketId) + 1;
  };

  // Get all waiting tickets
  const getAllWaitingTickets = (): QueueTicket[] => {
    return queue.filter(ticket => ticket.status === "waiting")
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  };

  // Get service by prefix
  const getServiceByPrefix = (prefix: string): ServiceType | undefined => {
    return services.find(service => service.prefix === prefix);
  };

  // Get last ticket that was added
  const getLastTicket = (): QueueTicket | null => {
    if (queue.length === 0) return null;
    return queue[queue.length - 1];
  };

  const value = {
    services,
    counters,
    queue,
    addToQueue,
    callNext,
    completeService,
    setCounterStatus,
    setCounterService,
    getWaitingCount,
    getTicketPosition,
    getAllWaitingTickets,
    getServiceByPrefix,
    getLastTicket
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
};
