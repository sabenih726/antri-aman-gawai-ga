
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueue, ServiceType } from "@/context/QueueContext";
import { CheckCircle, Ticket } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface QueueNumberGeneratorProps {
  showTitle?: boolean;
}

const QueueNumberGenerator: React.FC<QueueNumberGeneratorProps> = ({ showTitle = true }) => {
  const { services, addToQueue } = useQueue();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateTicket = (serviceId: string) => {
    setSelectedService(serviceId);
    const number = addToQueue(serviceId);
    setTicketNumber(number);
    
    toast({
      title: "Nomor Antrian",
      description: `Nomor antrian Anda adalah ${number}`,
    });
  };

  const handleNewTicket = () => {
    setSelectedService(null);
    setTicketNumber(null);
  };

  if (ticketNumber) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center bg-primary text-white rounded-t-lg">
          <CardTitle className="text-2xl">Nomor Antrian Anda</CardTitle>
          <CardDescription className="text-white">Silakan menunggu nomor Anda dipanggil</CardDescription>
        </CardHeader>
        <CardContent className="p-8 flex flex-col items-center">
          <div className="text-7xl font-bold my-6 text-primary">{ticketNumber}</div>
          <div className="text-xl mb-4">
            {services.find(s => s.id === selectedService)?.name}
          </div>
          <CheckCircle className="text-green-500 w-16 h-16 my-4" />
          <p className="text-gray-500 mb-4 text-center">
            Harap simpan nomor antrian ini dan tunggu hingga nomor Anda dipanggil
          </p>
          <Button onClick={handleNewTicket} className="mt-4">
            Ambil Nomor Baru
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      {showTitle && (
        <CardHeader>
          <CardTitle>Ambil Nomor Antrian</CardTitle>
          <CardDescription>Pilih layanan yang Anda butuhkan</CardDescription>
        </CardHeader>
      )}
      <CardContent className="grid gap-4">
        {services.map((service) => (
          <Button
            key={service.id}
            variant="outline"
            className="h-24 justify-start gap-4 p-4 hover:bg-secondary"
            onClick={() => handleGenerateTicket(service.id)}
          >
            <Ticket className="h-6 w-6" />
            <div className="flex flex-col items-start">
              <div className="font-semibold">{service.name}</div>
              <div className="text-sm text-muted-foreground">
                Menunggu: {service.waiting} orang
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default QueueNumberGenerator;
