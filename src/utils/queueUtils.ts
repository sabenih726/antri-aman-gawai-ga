
import { QueueTicket, ServiceType } from "../types/queueTypes";

// Get waiting count for a service
export const getWaitingCount = (queue: QueueTicket[], serviceType: string): number => {
  return queue.filter(
    ticket => ticket.serviceType === serviceType && ticket.status === "waiting"
  ).length;
};

// Get position in queue
export const getTicketPosition = (queue: QueueTicket[], ticketId: string): number | null => {
  const ticket = queue.find(t => t.id === ticketId);
  if (!ticket || ticket.status !== "waiting") return null;
  
  const waitingTickets = queue.filter(
    t => t.serviceType === ticket.serviceType && t.status === "waiting"
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  return waitingTickets.findIndex(t => t.id === ticketId) + 1;
};

// Get all waiting tickets
export const getAllWaitingTickets = (queue: QueueTicket[]): QueueTicket[] => {
  return queue.filter(ticket => ticket.status === "waiting")
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

// Get service by prefix
export const getServiceByPrefix = (services: ServiceType[], prefix: string): ServiceType | undefined => {
  return services.find(service => service.prefix === prefix);
};

// Get last ticket that was added
export const getLastTicket = (queue: QueueTicket[]): QueueTicket | null => {
  if (queue.length === 0) return null;
  return queue[queue.length - 1];
};

// Update service waiting counts
export const updateServiceWaitingCounts = (
  services: ServiceType[],
  queue: QueueTicket[]
): ServiceType[] => {
  return services.map(service => {
    const waitingCount = queue.filter(
      ticket => ticket.serviceType === service.id && ticket.status === "waiting"
    ).length;
    
    return { ...service, waiting: waitingCount };
  });
};
