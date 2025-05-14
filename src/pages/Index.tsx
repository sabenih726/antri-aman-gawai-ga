
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, LayoutDashboard, Users, Clock } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Sistem Antrian</h1>
          <nav>
            <Link to="/admin-login">
              <Button variant="outline" size="sm">
                Admin Login
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Selamat Datang di Sistem Antrian Digital
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Nikmati kenyamanan mengantre tanpa perlu berdiri dalam barisan. Ambil nomor antrian dan kami akan memberitahu Anda saat giliran Anda tiba.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader className="text-center">
                <Users className="mx-auto h-8 w-8 text-primary mb-2" />
                <CardTitle>Ambil Nomor</CardTitle>
                <CardDescription>Dapatkan nomor antrian dengan cepat</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p>Pilih layanan yang Anda butuhkan dan dapatkan nomor antrian secara instan.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <Clock className="mx-auto h-8 w-8 text-primary mb-2" />
                <CardTitle>Pantau Status</CardTitle>
                <CardDescription>Lihat perkiraan waktu tunggu</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p>Cek posisi antrian dan perkiraan waktu tunggu Anda.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <LayoutDashboard className="mx-auto h-8 w-8 text-primary mb-2" />
                <CardTitle>Tampilan Digital</CardTitle>
                <CardDescription>Lihat display antrian real-time</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p>Pantau nomor antrian yang sedang dilayani di layar display.</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Button size="lg" asChild className="px-8 py-6 text-lg">
              <Link to="/queue">
                Ambil Nomor Antrian
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/display">
                  Lihat Display Antrian
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Sistem Antrian Digital. Semua hak dilindungi.
        </div>
      </footer>
    </div>
  );
}
