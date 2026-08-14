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

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError(null);
      // Construct form data for OAuth2 spec login endpoint
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const response = await api.post<AuthResponse>("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      
      setAuth(response.data.user, response.data.access_token);
      router.push("/diary");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to sign in. Please check your credentials.");
    }
  };

  return (
    <div className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-8 backdrop-blur-xl bg-opacity-80">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mb-4">
          <Globe className="h-7 w-7 text-[var(--color-primary)]" />
        </div>
        <h1 className="text-2xl font-bold text-center">Welcome back</h1>
        <p className="text-[var(--color-muted-foreground)] text-sm mt-2">Sign in to your PocketSafar account</p>
      </div>

      {error && (
        <div className="mb-6 p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Username or Email</label>
          <input
            {...register("username")}
            type="text"
            className="w-full px-4 py-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-input)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors outline-none"
            placeholder="Enter your username"
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
        </button>
      </form>

      <div className="mt-6 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-[var(--color-border)] after:mt-0.5 after:flex-1 after:border-t after:border-[var(--color-border)]">
        <p className="mx-4 mb-0 text-center text-sm text-[var(--color-muted-foreground)]">or</p>
      </div>

      <button className="mt-6 w-full py-3 px-4 bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-foreground)] font-semibold rounded-xl hover:bg-[var(--color-muted)] transition-colors flex justify-center items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        </svg>
        Continue with Google
      </button>

      <p className="mt-8 text-center text-sm text-[var(--color-muted-foreground)]">
        Don't have an account?{" "}
        <Link href="/register" className="text-[var(--color-primary)] hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
