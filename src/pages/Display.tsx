
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQueue } from "@/context/QueueContext";
import { Card } from "@/components/ui/card";
import { Clock, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

const Display = () => {
  const { counters, queue, services } = useQueue();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update the clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format the current date and time
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentTime);
  
  const formattedTime = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(currentTime);
  
  // Get active counters that are serving someone
  const activeCounters = counters.filter(
    counter => counter.status === "active" && counter.currentlyServing
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-primary text-white">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild className="mr-4 text-white hover:text-white hover:bg-primary/90">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Display Antrian</h1>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            <div>
              <div className="text-sm font-medium">{formattedDate}</div>
              <div className="text-lg font-bold">{formattedTime}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-primary text-white p-4 text-center">
              <h2 className="text-2xl font-bold">NOMOR ANTRIAN YANG SEDANG DILAYANI</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
              {activeCounters.length > 0 ? (
                activeCounters.map((counter) => (
                  <div key={counter.id} className="bg-white rounded-lg shadow-md p-4 text-center">
                    <div className="text-gray-600 text-lg mb-2">{counter.name}</div>
                    <div className="text-5xl font-bold text-primary my-4">
                      {counter.currentlyServing}
                    </div>
                    <div className="text-sm text-gray-500">
                      {counter.serviceType && services.find(s => s.id === counter.serviceType)?.name}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-4 text-center py-12 text-gray-500">
                  <p className="text-2xl">Tidak ada antrian yang sedang dilayani</p>
                </div>
              )}
            </div>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden">
                <div className="bg-secondary p-3">
                  <h3 className="font-semibold">{service.name}</h3>
                </div>
                <div className="p-4 text-center">
                  <div className="text-sm text-gray-500 mb-1">Menunggu</div>
                  <div className="text-3xl font-bold">{service.waiting}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Display;
