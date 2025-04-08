
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center mb-2">
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Link>
            </Button>
          </div>
          <CardTitle className="text-2xl text-center flex items-center justify-center">
            <KeyRound className="h-6 w-6 mr-2" />
            Login Admin
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
