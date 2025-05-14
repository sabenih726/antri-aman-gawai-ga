
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

export type QueueContextType = {
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
