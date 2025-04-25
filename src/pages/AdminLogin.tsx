
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, KeyRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (login(password)) {
      toast({
        title: "Login berhasil",
        description: "Anda berhasil masuk sebagai admin",
        duration: 3000,
      });
      navigate("/admin");
    } else {
      toast({
        title: "Login gagal",
        description: "Password yang Anda masukkan salah",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[#1a365d]">
            Login Admin
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                placeholder="Masukkan password admin"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full bg-[#1a365d]">
              Login
            </Button>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="text-sm text-[#1a365d]">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
