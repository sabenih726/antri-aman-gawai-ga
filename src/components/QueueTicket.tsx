
import { useQueue, QueueTicket as TicketType } from "@/context/QueueContext";
import { Card, CardContent } from "@/components/ui/card";
import { Ticket, Clock } from "lucide-react";

interface QueueTicketProps {
  ticket: TicketType;
  showPosition?: boolean;
}

const QueueTicket: React.FC<QueueTicketProps> = ({ ticket, showPosition = false }) => {
  const { getTicketPosition, services } = useQueue();
  const position = showPosition ? getTicketPosition(ticket.id) : null;
  
  const service = services.find(s => s.id === ticket.serviceType);
  
  // Format timestamp to readable time
  const formattedTime = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(ticket.timestamp);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-primary text-white p-3 flex justify-between items-center">
          <div className="flex items-center">
            <Ticket className="h-5 w-5 mr-2" />
            <span className="font-semibold">{service?.name}</span>
          </div>
          <div className="text-sm flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {formattedTime}
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between">
            <div>
              <span className="text-gray-500 text-sm">Nomor Antrian</span>
              <div className="text-3xl font-bold text-primary">{ticket.number}</div>
            </div>
            {showPosition && position !== null && (
              <div className="text-right">
                <span className="text-gray-500 text-sm">Posisi</span>
                <div className="text-3xl font-bold text-primary">#{position}</div>
              </div>
            )}
          </div>
          <div className="mt-2">
            <span className="text-gray-500 text-sm">Status</span>
            <div className="text-sm mt-1">
              {ticket.status === "waiting" && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                  Menunggu
                </span>
              )}
              {ticket.status === "serving" && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  Sedang Dilayani
                </span>
              )}
              {ticket.status === "completed" && (
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                  Selesai
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QueueTicket;
