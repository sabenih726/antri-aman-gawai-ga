
import { useQueue } from "@/context/QueueContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const QueueStatistics = () => {
  const { services, queue, counters } = useQueue();
  
  // Data untuk grafik pie distribusi layanan
  const pieData = services.map(service => ({
    name: service.name,
    value: service.served + service.waiting,
    color: getRandomColor(service.id)
  }));
  
  // Data untuk grafik batang waktu tunggu rata-rata
  const barData = services.map(service => ({
    name: service.name,
    averageWait: service.averageWaitTime || Math.floor(Math.random() * 10) + 5, // Simulasi data waktu tunggu
    color: getRandomColor(service.id)
  }));
  
  // Total tiket yang sudah dilayani dan yang masih menunggu
  const totalServed = services.reduce((acc, service) => acc + service.served, 0);
  const totalWaiting = services.reduce((acc, service) => acc + service.waiting, 0);
  
  // Persentase tiket yang sudah dilayani
  const servedPercentage = totalServed + totalWaiting > 0 
    ? Math.round((totalServed / (totalServed + totalWaiting)) * 100) 
    : 0;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tiket Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServed + totalWaiting}</div>
            <p className="text-xs text-muted-foreground">
              {totalServed} dilayani, {totalWaiting} menunggu
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Persentase Dilayani</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servedPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              {totalServed} dari {totalServed + totalWaiting} tiket
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Loket Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {counters.filter(counter => counter.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Dari total {counters.length} loket
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribusi Layanan</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Waktu Tunggu Rata-rata</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Menit', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value} menit`, 'Waktu Tunggu']} />
                <Bar dataKey="averageWait" name="Waktu Tunggu (menit)">
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Fungsi helper untuk mendapatkan warna berdasarkan ID
const getRandomColor = (id: number) => {
  const colors = [
    "#8B5CF6", "#D946EF", "#F97316", "#0EA5E9", 
    "#10B981", "#F59E0B", "#EF4444", "#6366F1"
  ];
  return colors[id % colors.length];
};

export default QueueStatistics;
