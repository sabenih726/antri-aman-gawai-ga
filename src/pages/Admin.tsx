import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQueue } from "@/context/QueueContext";
import CounterCard from "@/components/CounterCard";
import QueueStats from "@/components/QueueStats";
import ServiceSelection from "@/components/ServiceSelection";
import QueueStatistics from "@/components/QueueStatistics";
import { ArrowLeft, LogOut, LayoutDashboard, Activity, Users, Settings, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Admin = () => {
  const { counters, services, queue, callNext, completeService, getWaitingCount } = useQueue();
  const { logout, getCurrentUser } = useAuth();
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Refresh setiap 10 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 10000);
    
    return () => clearInterval(timer);
  }, []);

  // Mendapatkan tiket yang sedang menunggu
  const waitingTickets = queue.filter(ticket => ticket.status === "waiting")
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Mendapatkan tiket yang sedang dilayani
  const servingTickets = queue.filter(ticket => ticket.status === "serving");

  // Handler untuk memanggil tiket berikutnya
  const handleCallNext = (counterId: number, serviceType: string) => {
    const nextTicket = callNext(counterId, serviceType);
    if (nextTicket) {
      // Tampilkan notifikasi atau feedback visual
      console.log(`Memanggil nomor ${nextTicket.number} ke counter ${counterId}`);
    } else {
      console.log(`Tidak ada tiket yang menunggu untuk layanan ${serviceType}`);
    }
  };

  // Handler untuk menandai tiket selesai dilayani
  const handleCompleteService = (ticketId: string) => {
    completeService(ticketId);
    console.log(`Tiket ${ticketId} telah selesai dilayani`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col bg-white shadow-sm h-screen fixed">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-primary">Panel Admin</h2>
            <p className="text-sm text-gray-500">Selamat datang, {getCurrentUser()}</p>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/admin">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/admin">
                    <Activity className="mr-2 h-4 w-4" />
                    Statistik
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/admin">
                    <Users className="mr-2 h-4 w-4" />
                    Manajemen Counter
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/admin">
                    <Settings className="mr-2 h-4 w-4" />
                    Pengaturan
                  </Link>
                </Button>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start text-red-500" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 md:ml-64">
          <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <div className="flex items-center md:hidden">
                <Button variant="ghost" size="sm" asChild className="mr-4">
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali
                  </Link>
                </Button>
                <h1 className="text-xl font-bold text-primary">Panel Admin</h1>
              </div>
              <div className="md:hidden">
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <TabsList className="mb-4">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="queue">Antrian</TabsTrigger>
                <TabsTrigger value="statistics">Statistik</TabsTrigger>
                <TabsTrigger value="counters">Loket</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Dashboard Admin</h1>
                  <Button size="sm" variant="outline" onClick={() => setRefreshTrigger(prev => prev + 1)}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </Button>
                </div>
                <QueueStats />
                <QueueStatistics />
              </TabsContent>
              
              <TabsContent value="queue" className="space-y-6">
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Manajemen Antrian</h2>
                    <Button size="sm" variant="outline" onClick={() => setRefreshTrigger(prev => prev + 1)}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Antrian
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Antrian Menunggu</h3>
                      <ScrollArea className="h-[250px] border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nomor Antrian</TableHead>
                              <TableHead>Layanan</TableHead>
                              <TableHead>Waktu Pendaftaran</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Aksi</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {waitingTickets.length > 0 ? (
                              waitingTickets.map((ticket) => {
                                // Temukan layanan untuk tiket ini
                                const service = services.find(s => s.id === ticket.serviceType);
                                return (
                                  <TableRow key={ticket.id}>
                                    <TableCell className="font-medium">{ticket.number}</TableCell>
                                    <TableCell>{service?.name || ticket.serviceType}</TableCell>
                                    <TableCell>{new Date(ticket.timestamp).toLocaleTimeString()}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                                        Menunggu
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      {counters.map((counter) => {
                                        if (counter.status === "active" && (counter.serviceType === ticket.serviceType || !counter.serviceType)) {
                                          return (
                                            <Button 
                                              key={counter.id} 
                                              size="sm" 
                                              variant="outline" 
                                              className="mr-2 mb-1"
                                              onClick={() => handleCallNext(counter.id, ticket.serviceType)}
                                            >
                                              Panggil ke {counter.name}
                                            </Button>
                                          );
                                        }
                                        return null;
                                      })}
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            ) : (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                  Tidak ada tiket dalam antrian
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Sedang Dilayani</h3>
                      <ScrollArea className="h-[250px] border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nomor Antrian</TableHead>
                              <TableHead>Layanan</TableHead>
                              <TableHead>Counter</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Aksi</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {servingTickets.length > 0 ? (
                              servingTickets.map((ticket) => {
                                // Temukan layanan dan counter untuk tiket ini
                                const service = services.find(s => s.id === ticket.serviceType);
                                const counter = counters.find(c => c.id === ticket.counterAssigned);
                                return (
                                  <TableRow key={ticket.id}>
                                    <TableCell className="font-medium">{ticket.number}</TableCell>
                                    <TableCell>{service?.name || ticket.serviceType}</TableCell>
                                    <TableCell>{counter?.name || `-`}</TableCell>
                                    <TableCell>
                                      <Badge className="bg-green-100 text-green-700">
                                        Dilayani
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="text-green-700 border-green-700 hover:bg-green-50"
                                        onClick={() => handleCompleteService(ticket.id)}
                                      >
                                        Selesaikan
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            ) : (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                  Tidak ada tiket yang sedang dilayani
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="statistics" className="space-y-6">
                <Card className="p-6">
                  <QueueStatistics />
                </Card>
              </TabsContent>
              
              <TabsContent value="counters" className="space-y-6">
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
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Admin;
