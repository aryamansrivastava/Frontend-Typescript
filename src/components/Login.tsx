import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { z } from "zod";
import { useDispatch } from "react-redux";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

interface LoginResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

type FormState = {
  email: string;
  password: string;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

const Login = () => {
  const dispatch = useDispatch();

  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("signupEmail");
    const storedPassword = localStorage.getItem("signupPassword");

    if (storedEmail && storedPassword) {
      setForm({ email: storedEmail, password: storedPassword });
      localStorage.removeItem("signupEmail");
      localStorage.removeItem("signupPassword");
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      console.log("Auth token set");
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = loginSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setErrors({});

    try {
      const { data } = await axios.post<LoginResponse>(`${import.meta.env.VITE_API_URL}/login`, form);

      console.log("Login Response:", data);

      setUser({
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });

      if (data.token) {
        sessionStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

        const verifyRes = await axios.get(`${import.meta.env.VITE_API_URL}/verify-token`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        });
  
        if (verifyRes.status === 200) {
          window.location.href = "/feed";
        } else {
          console.error("Token verification failed");
        }
      } else {
        console.error("Token not received");
      }
    } 
    catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-900 text-white py-8">
      <div className="bg-gray-800 p-5 rounded-lg shadow-lg w-full sm:w-96 max-w-md border border-gray-700 transition-all transform">
        <h2 className="text-3xl font-bold text-center text-purple-300 mb-5">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            className="p-3 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-300 text-white placeholder-gray-400"
          />
          {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            className="p-3 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-300 text-white placeholder-gray-400"
          />
          {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}

          <button
            type="submit"
            className="bg-blue-500 p-3 rounded text-white hover:bg-blue-600 transition duration-300 w-full"
          >
            Log In
          </button>

          <p className="mt-4 text-center text-gray-400 text-sm">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-purple-400 hover:text-purple-200 transition-colors duration-300">
              Register here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;