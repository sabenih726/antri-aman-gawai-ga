
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQueue } from "@/context/QueueContext";
import CounterCard from "@/components/CounterCard";
import QueueStats from "@/components/QueueStats";
import ServiceSelection from "@/components/ServiceSelection";
import { ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Admin = () => {
  const { counters } = useQueue();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild className="mr-4">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-primary">Panel Admin</h1>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <QueueStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Manajemen Counter</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {counters.map((counter) => (
                  <CounterCard key={counter.id} counter={counter} />
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Statistik Layanan</h2>
              <ServiceSelection />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
