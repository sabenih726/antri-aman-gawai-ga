
import { useState, useEffect } from "react";
import { useQueue } from "@/context/QueueContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import QueueNumberGenerator from "@/components/QueueNumberGenerator";
import { ArrowLeft, Clock, Users, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Queue = () => {
  const { getAllWaitingTickets, services, getTicketPosition } = useQueue();
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [waitingCount, setWaitingCount] = useState<number>(0);
  const { toast } = useToast();
  
  // Function to refresh data manually
  const handleRefresh = () => {
    // Force reload by triggering storage events
    ['queue_services', 'queue_counters', 'queue_tickets'].forEach(key => {
      const storageEventInit: StorageEventInit = {
        key,
        newValue: localStorage.getItem(key),
        oldValue: null,
        storageArea: localStorage,
        url: window.location.href
      };
      window.dispatchEvent(new StorageEvent('storage', storageEventInit));
    });
    
    // Update waiting count from latest data
    setWaitingCount(getAllWaitingTickets().length);
    
    toast({
      title: "Data Diperbarui",
      description: "Data antrian telah diperbarui dengan data terbaru"
    });
  };
  
  // Update waiting count setiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setWaitingCount(getAllWaitingTickets().length);
      
      // Force a storage event to sync data across tabs
      const forceRefresh = () => {
        const storageEventInit: StorageEventInit = {
          key: 'queue_tickets',
          newValue: localStorage.getItem('queue_tickets'),
          oldValue: null,
          storageArea: localStorage,
          url: window.location.href
        };
        window.dispatchEvent(new StorageEvent('storage', storageEventInit));
      };
      
      forceRefresh();
    }, 5000);
    
    // Initial count
    setWaitingCount(getAllWaitingTickets().length);
    
    return () => clearInterval(timer);
  }, [getAllWaitingTickets]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Beranda
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">Sistem Antrian</h1>
          <div className="flex space-x-4">
            <Badge variant="outline" className="flex items-center gap-1 py-1 px-3">
              <Users size={16} />
              <span>{waitingCount} menunggu</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 py-1 px-3">
              <Clock size={16} />
              <span>Estimasi: {waitingCount > 0 ? `~${waitingCount * 5} menit` : "0 menit"}</span>
            </Badge>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <QueueNumberGenerator />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Antrian</CardTitle>
                <CardDescription>Status antrian saat ini</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map(service => {
                    return (
                      <div key={service.id} className="p-4 border rounded-lg">
                        <h3 className="font-medium text-lg mb-2">{service.name}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Menunggu</p>
                            <p className="text-2xl font-bold">{service.waiting}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Estimasi Waktu</p>
                            <p className="text-2xl font-bold">~{service.averageWaitTime || 5} menit</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Tips</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    <li>Simpan nomor antrian Anda</li>
                    <li>Perhatikan layar display saat nomor Anda dipanggil</li>
                    <li>Segera menuju ke counter yang memanggil nomor Anda</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Cek Status Antrian</CardTitle>
                <CardDescription>Lihat display panggilan antrian</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/display">Lihat Display Antrian</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Queue;
