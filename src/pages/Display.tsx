
import React, { useEffect, useState } from "react";
import { useQueue } from "@/context/QueueContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CurrentServing from "@/components/CurrentServing";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Display = () => {
  const { queue, counters, services } = useQueue();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

  // Automatically refresh data every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
      
      // Force a storage event to sync data across tabs
      const forceRefresh = () => {
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
      };
      
      forceRefresh();
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);

  // Manual refresh
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
    
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: "Data Diperbarui",
      description: "Display antrian telah diperbarui dengan data terbaru"
    });
  };

  // Get serving tickets
  const servingTickets = queue
    .filter(ticket => ticket.status === "serving")
    .map(ticket => {
      const counter = counters.find(c => c.id === ticket.counterAssigned);
      const service = services.find(s => s.id === ticket.serviceType);
      return { ...ticket, counterName: counter?.name || "", serviceName: service?.name || "" };
    });

  // Get waiting tickets (limited to 10)
  const waitingTickets = queue
    .filter(ticket => ticket.status === "waiting")
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-primary text-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Display Antrian</h1>
          <div className="text-sm ml-6">
            {new Date().toLocaleDateString("id-ID", { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric'
            })}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="sm" onClick={handleRefresh} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          
          <Button variant="secondary" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="grid gap-8">
          <CurrentServing />
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="bg-blue-50 border-b">
                <CardTitle className="text-lg text-blue-800">Daftar Menunggu</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {waitingTickets.length > 0 ? (
                    waitingTickets.map((ticket, index) => {
                      const service = services.find(s => s.id === ticket.serviceType);
                      return (
                        <div 
                          key={ticket.id} 
                          className={`p-4 flex items-center justify-between ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                        >
                          <div>
                            <span className="font-medium text-primary">{ticket.number}</span>
                            <span className="text-gray-500 text-sm ml-2">
                              ({service?.name || ticket.serviceType})
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(ticket.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      Tidak ada antrian yang menunggu
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-green-50 border-b">
                <CardTitle className="text-lg text-green-800">Status Counter</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {counters.map((counter, index) => {
                    const serviceInfo = counter.serviceType 
                      ? services.find(s => s.id === counter.serviceType)?.name
                      : "Semua layanan";
                    
                    return (
                      <div 
                        key={counter.id} 
                        className={`p-4 flex justify-between items-center ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                      >
                        <div>
                          <div className="font-medium">{counter.name}</div>
                          <div className="text-sm text-gray-500">{serviceInfo}</div>
                        </div>
                        <div>
                          {counter.status === "active" ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Aktif
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                              Nonaktif
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Display;
