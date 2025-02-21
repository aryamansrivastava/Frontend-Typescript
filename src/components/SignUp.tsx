import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";

const toastStyle: React.CSSProperties = {
  userSelect: "none",
};

const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long."),
});

type FormState = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = signUpSchema.safeParse(form);
    if (!result.success) {
      result.error.errors.forEach((err) => {
        toast.error(`⚠️ ${err.message}`, {
          style: toastStyle,
        });
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/signup", form);

      if (response.status === 201) {
        toast.success("🎉 Account created successfully!", {
          style: toastStyle,
        });

        localStorage.setItem("signupEmail", form.email);
        localStorage.setItem("signupPassword", form.password);

        window.location.href = "/login";
      }
    } catch (error) {
      toast.error("❌ Something went wrong. Please try again.", {
        style: toastStyle,
      });
      console.error("Signup failed", error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-gray-800 p-5 rounded-lg shadow-lg w-full sm:w-96 max-w-md border border-gray-700 transition-all transform">
        <h2 className="text-3xl font-bold text-center text-purple-300 mb-5">Create a New Account</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            className="p-3 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-300 text-white placeholder-gray-400"
          />

          <input
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            className="p-3 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-300 text-white placeholder-gray-400"
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="p-3 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-300 text-white placeholder-gray-400"
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="p-3 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-300 text-white placeholder-gray-400"
          />

          <button
            type="submit"
            className="bg-blue-500 p-3 rounded text-white hover:bg-blue-600 transition duration-300 w-full"
          >
            Sign Up
          </button>

          <p className="mt-4 text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-purple-400 hover:text-purple-200 transition-colors duration-300">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;