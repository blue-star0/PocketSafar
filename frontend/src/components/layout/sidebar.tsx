"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe, BookOpen, Map, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

const navItems = [
  { name: "Diary", href: "/diary", icon: BookOpen },
  { name: "Trips", href: "/trips", icon: Map },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[var(--color-sidebar)] border-r border-[var(--color-sidebar-border)] md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-[var(--color-sidebar-border)]">
        <Link href="/" className="flex items-center gap-2 group">
          <Globe className="h-6 w-6 text-[var(--color-primary)] group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-xl font-bold tracking-tight text-[var(--color-sidebar-foreground)]">PocketSafar</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[var(--color-primary)] text-white shadow-md shadow-indigo-500/20"
                  : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-sidebar-accent)] hover:text-[var(--color-sidebar-foreground)]"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-3 border-t border-[var(--color-sidebar-border)]">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
