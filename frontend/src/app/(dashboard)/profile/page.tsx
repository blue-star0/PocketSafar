"use client";

import { useAuthStore } from "@/stores/auth-store";
import { getInitials, formatDate } from "@/lib/utils";
import { Award, Mail, Calendar, Edit2, Shield } from "lucide-react";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-6">Profile Settings</h1>
      
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
        <div className="h-32 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"></div>
        <div className="px-6 sm:px-10 pb-10 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 mb-6">
            <div className="flex items-end gap-5">
              <div className="h-24 w-24 rounded-2xl bg-[var(--color-background)] p-1 border border-[var(--color-border)] shadow-md">
                <div className="h-full w-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-xl flex items-center justify-center text-3xl font-bold">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="h-full w-full rounded-xl object-cover" />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
              </div>
              <div className="pb-1">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-[var(--color-muted-foreground)]">@{user.username}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-muted)] hover:bg-[var(--color-border)] text-[var(--color-foreground)] rounded-lg font-medium transition-colors text-sm">
              <Edit2 className="h-4 w-4" /> Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-3">About</h3>
                <p className="text-[var(--color-foreground)] leading-relaxed">
                  {user.bio || "No bio added yet. Tell the community about your travel style!"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-3">Contact Info</h3>
                <div className="flex items-center gap-3 text-[var(--color-foreground)]">
                  <Mail className="h-5 w-5 text-[var(--color-muted-foreground)]" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-lg">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted-foreground)] font-medium">Total Points</p>
                    <p className="text-lg font-bold">{user.total_points || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted-foreground)] font-medium">Member Since</p>
                    <p className="text-sm font-bold">{user.created_at ? formatDate(user.created_at) : 'Recently'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted-foreground)] font-medium">Badges</p>
                    <p className="text-sm font-bold">{user.badges?.length || 0} Earned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
