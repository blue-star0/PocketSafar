"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Mail,
  Edit2,
  Save,
  X,
  Award,
  BookOpen,
  Map,
  LogOut,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import api from "@/lib/api";
import { getInitials, formatDate } from "@/lib/utils";
import type { User as UserType } from "@/types";

const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  bio: z
    .string()
    .max(300, "Bio cannot exceed 300 characters")
    .optional()
    .nullable(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, clearAuth } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name || "",
      bio: user?.bio || "",
    },
  });

  const bioValue = watch("bio") || "";

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
      </div>
    );
  }

  const handleStartEdit = () => {
    reset({
      name: user.name || "",
      bio: user.bio || "",
    });
    setIsEditing(true);
    setStatusMessage(null);
  };

  const handleCancelEdit = () => {
    reset({
      name: user.name || "",
      bio: user.bio || "",
    });
    setIsEditing(false);
    setStatusMessage(null);
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setStatusMessage(null);
      const res = await api.put<UserType>("/users/me", {
        name: data.name.trim(),
        bio: data.bio ? data.bio.trim() : null,
      });

      // Update Zustand state and localStorage
      setUser(res.data);
      setIsEditing(false);
      setStatusMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setStatusMessage({
        type: "error",
        text:
          typeof detail === "string"
            ? detail
            : "Failed to update profile. Please try again.",
      });
    }
  };

  const handleSignOut = () => {
    clearAuth();
    router.push("/login");
  };

  const badgesList = user.badges && user.badges.length > 0
    ? user.badges
    : ["Explorer", "Pioneer", "Storyteller"];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-foreground)]">
            Account Profile
          </h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
            Manage your personal details, explorer credentials, and travel achievements.
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>

      {/* Status notification */}
      {statusMessage && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-sm transition-all duration-300 ${
            statusMessage.type === "success"
              ? "bg-[var(--color-success)]/10 border-[var(--color-success)]/20 text-[var(--color-success)]"
              : "bg-[var(--color-danger)]/10 border-[var(--color-danger)]/20 text-[var(--color-danger)]"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <span className="font-medium">{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="ml-auto p-1 hover:opacity-75"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
        {/* Cover banner */}
        <div className="h-40 sm:h-48 bg-gradient-to-r from-[var(--color-primary)] via-indigo-600 to-[var(--color-secondary)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-60" />
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            Verified Explorer
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-6 sm:px-10 pb-8 relative">
          {/* Avatar and Action bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              {/* Avatar circle */}
              <div className="relative">
                <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-[var(--color-background)] p-1.5 border-4 border-[var(--color-card)] shadow-xl">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name || user.username}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white flex items-center justify-center text-2xl sm:text-3xl font-extrabold tracking-wider shadow-inner">
                      {getInitials(user.name || user.username)}
                    </div>
                  )}
                </div>
                <div
                  className="absolute bottom-1 right-1 h-6 w-6 rounded-full bg-[var(--color-success)] border-2 border-[var(--color-card)] flex items-center justify-center text-white"
                  title="Active"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Title & username */}
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-foreground)]">
                    {user.name || user.username}
                  </h2>
                </div>
                <p className="text-sm font-medium text-[var(--color-muted-foreground)] flex items-center gap-1.5 mt-0.5">
                  <User className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                  @{user.username}
                </p>
              </div>
            </div>

            {/* Edit / Actions */}
            <div>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-muted)] hover:bg-[var(--color-border)] text-[var(--color-foreground)] rounded-xl font-semibold transition-all text-sm border border-[var(--color-border)] shadow-sm hover:shadow active:scale-95"
                >
                  <Edit2 className="h-4 w-4 text-[var(--color-primary)]" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[var(--color-background)] hover:bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] rounded-xl font-medium transition-all text-sm border border-[var(--color-border)] disabled:opacity-60"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-xl font-semibold transition-all text-sm shadow-md shadow-indigo-500/20 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form or Display View */}
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4 border-t border-[var(--color-border)]">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-foreground)] mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted-foreground)]" />
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-input)] text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all outline-none text-sm"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-[var(--color-danger)] font-medium mt-1.5">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-[var(--color-foreground)]">
                      About / Bio
                    </label>
                    <span className="text-xs text-[var(--color-muted-foreground)] font-mono">
                      {bioValue.length}/300
                    </span>
                  </div>
                  <textarea
                    {...register("bio")}
                    rows={4}
                    placeholder="Tell fellow travelers about your journeys, wanderlust spirit, or favourite travel styles..."
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-input)] text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all outline-none text-sm resize-none"
                  />
                  {errors.bio && (
                    <p className="text-xs text-[var(--color-danger)] font-medium mt-1.5">
                      {errors.bio.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold transition-all shadow-md shadow-indigo-500/20 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4 border-t border-[var(--color-border)]">
              {/* Left Column: Bio & Info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-2.5">
                    Bio & Travel Style
                  </h3>
                  <p className="text-[var(--color-foreground)] text-sm leading-relaxed whitespace-pre-line bg-[var(--color-background)]/60 border border-[var(--color-border)] rounded-2xl p-4">
                    {user.bio || (
                      <span className="text-[var(--color-muted-foreground)] italic">
                        No bio added yet. Click &quot;Edit Profile&quot; to share your travel story with the PocketSafar community!
                      </span>
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-2.5">
                    Account Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)]">
                      <div className="p-2 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs text-[var(--color-muted-foreground)] font-medium">Email Address</p>
                        <p className="text-sm font-semibold text-[var(--color-foreground)] truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)]">
                      <div className="p-2 rounded-xl bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-[var(--color-muted-foreground)] font-medium">Member Since</p>
                        <p className="text-sm font-semibold text-[var(--color-foreground)]">
                          {user.created_at ? formatDate(user.created_at) : "Recently"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Achievements & Badges */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-2.5">
                    Earned Badges ({user.badges?.length || badgesList.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {badgesList.map((badge, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 shadow-xs"
                      >
                        <Award className="h-3.5 w-3.5" />
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-2.5">
                    Quick Navigation
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/diary"
                      className="flex items-center gap-2 p-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-xs font-semibold text-[var(--color-foreground)] transition-all group"
                    >
                      <BookOpen className="h-4 w-4 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
                      Travel Diary
                    </Link>
                    <Link
                      href="/trips"
                      className="flex items-center gap-2 p-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] hover:border-[var(--color-secondary)] text-xs font-semibold text-[var(--color-foreground)] transition-all group"
                    >
                      <Map className="h-4 w-4 text-[var(--color-secondary)] group-hover:scale-110 transition-transform" />
                      My Trips
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Points */}
        <div className="p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              Reward Points
            </span>
            <div className="p-2 rounded-xl bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[var(--color-foreground)]">
            {user.total_points || 0}
          </div>
          <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
            Points earned on adventures
          </p>
        </div>

        {/* Badges Count */}
        <div className="p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              Badges
            </span>
            <div className="p-2 rounded-xl bg-[var(--color-success)]/15 text-[var(--color-success)]">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[var(--color-foreground)]">
            {user.badges?.length || badgesList.length}
          </div>
          <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
            Milestones unlocked
          </p>
        </div>

        {/* Travel Diary */}
        <Link
          href="/diary"
          className="p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm hover:shadow-md hover:border-[var(--color-primary)] transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              Diary
            </span>
            <div className="p-2 rounded-xl bg-[var(--color-primary)]/15 text-[var(--color-primary)] group-hover:scale-110 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="text-lg font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
            Stories & Memories
          </div>
          <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
            View your travel journal &rarr;
          </p>
        </Link>

        {/* Trip Plans */}
        <Link
          href="/trips"
          className="p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm hover:shadow-md hover:border-[var(--color-secondary)] transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              Trips
            </span>
            <div className="p-2 rounded-xl bg-[var(--color-secondary)]/15 text-[var(--color-secondary)] group-hover:scale-110 transition-transform">
              <Map className="h-5 w-5" />
            </div>
          </div>
          <div className="text-lg font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-secondary)] transition-colors">
            Itineraries & Routes
          </div>
          <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
            Explore your journeys &rarr;
          </p>
        </Link>
      </div>
    </div>
  );
}
