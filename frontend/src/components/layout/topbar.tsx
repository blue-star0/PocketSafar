"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useAuthStore } from "@/stores/auth-store";
import { getInitials } from "@/lib/utils";
import { Menu } from "lucide-react";

export function Topbar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  // Derive title from pathname
  let title = "Dashboard";
  if (pathname.includes("/diary")) title = "Travel Diary";
  else if (pathname.includes("/trips")) title = "Trip Planner";
  else if (pathname.includes("/profile")) title = "Profile";

  return (
    <header className="fixed top-0 right-0 z-30 flex h-16 w-full md:w-[calc(100%-16rem)] items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-background)]/80 px-4 md:px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-[var(--color-muted-foreground)]">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold tracking-tight text-[var(--color-foreground)]">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        {user && (
          <div className="flex items-center gap-3 border-l border-[var(--color-border)] pl-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-[var(--color-foreground)]">{user.name}</span>
              <span className="text-xs text-[var(--color-muted-foreground)]">@{user.username}</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white shadow-sm ring-2 ring-[var(--color-background)]">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="h-full w-full rounded-full object-cover" />
              ) : (
                getInitials(user.name)
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
