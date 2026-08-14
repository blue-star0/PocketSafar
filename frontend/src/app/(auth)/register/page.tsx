"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Globe, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import type { AuthResponse } from "@/types";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError(null);
      const payload = {
        email: data.email,
        username: data.username,
        name: data.name,
        password: data.password,
      };

      const response = await api.post<AuthResponse>("/auth/register", payload);
      setAuth(response.data.user, response.data.access_token);
      router.push("/diary");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-8 backdrop-blur-xl bg-opacity-80">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mb-4">
          <Globe className="h-7 w-7 text-[var(--color-primary)]" />
        </div>
        <h1 className="text-2xl font-bold text-center">Create Account</h1>
        <p className="text-[var(--color-muted-foreground)] text-sm mt-2">Join PocketSafar to start your journey</p>
      </div>

      {error && (
        <div className="mb-6 p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              {...register("name")}
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-input)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors outline-none"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              {...register("username")}
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-input)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors outline-none"
              placeholder="johndoe"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full px-4 py-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-input)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors outline-none"
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-input)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors outline-none"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            {...register("confirmPassword")}
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-input)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors outline-none"
            placeholder="••••••••"
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors flex justify-center items-center gap-2 disabled:opacity-70 mt-4"
        >
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign Up"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--color-muted-foreground)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--color-primary)] hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
