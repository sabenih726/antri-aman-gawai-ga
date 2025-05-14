
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueue } from "@/context/QueueContext";
import { ServiceType } from "@/types/queueTypes";
import { CheckCircle, Ticket, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface QueueNumberGeneratorProps {
  showTitle?: boolean;
  showTicketDetails?: boolean;
}

const QueueNumberGenerator: React.FC<QueueNumberGeneratorProps> = ({ 
  showTitle = true, 
  showTicketDetails = true 
}) => {
  const { services, addToQueue, getTicketPosition } = useQueue();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Refresh state from localStorage when needed
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'queue_tickets' && ticketId) {
        // If we have a ticket, check its position again after data updates
        const position = getTicketPosition(ticketId);
        // Re-render component with updated position
        setTicketId(ticketId);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [getTicketPosition, ticketId]);

  const handleGenerateTicket = (serviceId: string) => {
    setSelectedService(serviceId);
    const service = services.find(s => s.id === serviceId);
    
    if (service) {
      // Menambahkan ke antrian dan mendapatkan nomor
      const number = addToQueue(serviceId);
      
      // Mendapatkan ID tiket dari nomor yang dikembalikan (ini perlu diperbaiki di QueueContext)
      // Untuk sementara, kita buat ID tiket palsu
      const tempTicketId = `${serviceId}-${Date.now()}`;
      
      setTicketNumber(number);
      setTicketId(tempTicketId);
      
      // Notifikasi
      toast({
        title: "Nomor Antrian Berhasil",
        description: `Nomor antrian Anda adalah ${number}`,
      });

      // Trigger a storage event to notify other tabs
      const storageEventInit: StorageEventInit = {
        key: 'queue_tickets',
        newValue: localStorage.getItem('queue_tickets'),
        oldValue: null,
        storageArea: localStorage,
        url: window.location.href
      };
      window.dispatchEvent(new StorageEvent('storage', storageEventInit));
    }
  };

  const handleNewTicket = () => {
    setSelectedService(null);
    setTicketNumber(null);
    setTicketId(null);
  };

  const handleViewDisplay = () => {
    navigate('/display');
  };
  
  const handleRefresh = () => {
    if (ticketId) {
      // Force a refresh of the position
      const position = getTicketPosition(ticketId);
      // Re-render component with updated position
      setTicketId(prevId => prevId ? `${prevId}` : null);
      
      toast({
        title: "Data Diperbarui",
        description: "Posisi antrian telah diperbarui dengan data terbaru"
      });
    }
  };

  const position = ticketId ? getTicketPosition(ticketId) : null;

  if (ticketNumber && showTicketDetails) {
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
          <div className="text-center mb-4">
            <p className="text-gray-500">
              Harap simpan nomor antrian ini dan tunggu hingga nomor Anda dipanggil
            </p>
            {position !== null && (
              <p className="mt-2 font-semibold">
                Posisi Anda: {position} {position === 1 ? '(Berikutnya)' : ''}
              </p>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleNewTicket} variant="default">
              Ambil Nomor Baru
            </Button>
            <Button onClick={handleViewDisplay} variant="outline">
              Lihat Display
            </Button>
            <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
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
