import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  ServiceType, 
  Counter, 
  QueueTicket, 
  QueueContextType 
} from "../types/queueTypes";
import { 
  initialServices, 
  initialCounters, 
  initialQueue 
} from "./queueInitialState";
import {
  getWaitingCount,
  getTicketPosition,
  getAllWaitingTickets,
  getServiceByPrefix,
  getLastTicket,
  updateServiceWaitingCounts
} from "../utils/queueUtils";

// Storage keys
const STORAGE_SERVICES_KEY = 'queue_services';
const STORAGE_COUNTERS_KEY = 'queue_counters';
const STORAGE_QUEUE_KEY = 'queue_tickets';

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("useQueue must be used within a QueueProvider");
  }
  return context;
};

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage or use default values
  const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
      const storedData = localStorage.getItem(key);
      return storedData ? JSON.parse(storedData) : defaultValue;
    } catch (err) {
      console.error(`Error loading ${key} from localStorage:`, err);
      return defaultValue;
    }
  };

  // State management with localStorage persistence
  const [services, setServices] = useState<ServiceType[]>(() => 
    loadFromStorage(STORAGE_SERVICES_KEY, initialServices)
  );
  
  const [counters, setCounters] = useState<Counter[]>(() => 
    loadFromStorage(STORAGE_COUNTERS_KEY, initialCounters)
  );
  
  const [queue, setQueue] = useState<QueueTicket[]>(() => {
    const loadedQueue = loadFromStorage(STORAGE_QUEUE_KEY, initialQueue);
    // Convert string dates back to Date objects
    return loadedQueue.map((ticket: any) => ({
      ...ticket,
      timestamp: new Date(ticket.timestamp),
      completedTimestamp: ticket.completedTimestamp ? new Date(ticket.completedTimestamp) : undefined
    }));
  });

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_SERVICES_KEY, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_COUNTERS_KEY, JSON.stringify(counters));
  }, [counters]);

  useEffect(() => {
    // We need to convert Date objects to strings for JSON storage
    const queueToStore = queue.map(ticket => ({
      ...ticket,
      // Keep as Date objects in memory, but store as ISO strings in localStorage
    }));
    localStorage.setItem(STORAGE_QUEUE_KEY, JSON.stringify(queueToStore));
  }, [queue]);

  // Listen for storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_SERVICES_KEY && event.newValue) {
        try {
          const newServices = JSON.parse(event.newValue);
          setServices(newServices);
        } catch (err) {
          console.error('Error parsing services from storage event:', err);
        }
      } else if (event.key === STORAGE_COUNTERS_KEY && event.newValue) {
        try {
          const newCounters = JSON.parse(event.newValue);
          setCounters(newCounters);
        } catch (err) {
          console.error('Error parsing counters from storage event:', err);
        }
      } else if (event.key === STORAGE_QUEUE_KEY && event.newValue) {
        try {
          const newQueue = JSON.parse(event.newValue);
          // Convert string dates back to Date objects
          setQueue(newQueue.map((ticket: any) => ({
            ...ticket,
            timestamp: new Date(ticket.timestamp),
            completedTimestamp: ticket.completedTimestamp ? new Date(ticket.completedTimestamp) : undefined
          })));
        } catch (err) {
          console.error('Error parsing queue from storage event:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update service waiting counts
  useEffect(() => {
    const updatedServices = updateServiceWaitingCounts(services, queue);
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

  const value: QueueContextType = {
    services,
    counters,
    queue,
    addToQueue,
    callNext,
    completeService,
    setCounterStatus,
    setCounterService,
    getWaitingCount: (serviceType: string) => getWaitingCount(queue, serviceType),
    getTicketPosition: (ticketId: string) => getTicketPosition(queue, ticketId),
    getAllWaitingTickets: () => getAllWaitingTickets(queue),
    getServiceByPrefix: (prefix: string) => getServiceByPrefix(services, prefix),
    getLastTicket: () => getLastTicket(queue)
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
};
