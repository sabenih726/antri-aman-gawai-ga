
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LayoutDashboard, Monitor, Settings } from "lucide-react";
import QueueNumberGenerator from "@/components/QueueNumberGenerator";
import CurrentServing from "@/components/CurrentServing";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Sistem Antrian GA</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin">
                <Settings className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/display">
                <Monitor className="mr-2 h-4 w-4" />
                Display
              </Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-6">
            <CurrentServing />
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Informasi</h2>
              <p className="text-gray-600 mb-4">
                Selamat datang di Sistem Antrian Divisi General Affairs. Silakan pilih layanan yang Anda butuhkan dan ambil nomor antrian.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>Pastikan untuk memilih jenis layanan yang sesuai</li>
                <li>Tunggu sampai nomor Anda dipanggil di layar display</li>
                <li>Perhatikan nomor counter yang memanggil Anda</li>
                <li>Mohon untuk tidak meninggalkan area tunggu ketika menunggu</li>
              </ul>
            </div>
          </div>
          
          <div>
            <QueueNumberGenerator />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
