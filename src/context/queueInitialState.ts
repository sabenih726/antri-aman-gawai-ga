
import { ServiceType, Counter, QueueTicket } from "../types/queueTypes";

// Initial services
export const initialServices: ServiceType[] = [
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
];

// Initial counters
export const initialCounters: Counter[] = [
  { id: 1, name: "Counter 1", status: "active", currentlyServing: null, serviceType: null },
  { id: 2, name: "Counter 2", status: "active", currentlyServing: null, serviceType: null },
  { id: 3, name: "Counter 3", status: "inactive", currentlyServing: null, serviceType: null },
  { id: 4, name: "Counter 4", status: "inactive", currentlyServing: null, serviceType: null },
];

// Initial queue
export const initialQueue: QueueTicket[] = [];
