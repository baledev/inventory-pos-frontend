import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { useNavigate } from 'react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type Inputs = {
  username: string
  password: string
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username: data.username,
        password: data.password
      });

      // Simpan token di localStorage atau di konteks
      const token = response.data.token;
      localStorage.setItem('jwtToken', token);

      login();
      navigate('/');
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login gagal! Cek kembali username dan password Anda.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Masuk ke akun Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="Masukkan username" {...register("username", { required: true })} />
                {errors.username && <p className="text-red-500 text-sm">Username wajib diisi.</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Masukkan password" {...register("password", { required: true })} />
                {errors.password && <p className="text-red-500 text-sm">Password wajib diisi.</p>}
              </div>
            </div>
            <Button type="submit" className="w-full mt-4">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}