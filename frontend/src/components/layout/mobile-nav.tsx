"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Map, User } from "lucide-react";

const navItems = [
  { name: "Diary", href: "/diary", icon: BookOpen },
  { name: "Trips", href: "/trips", icon: Map },
  { name: "Profile", href: "/profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-[var(--color-border)] bg-[var(--color-sidebar)]/95 backdrop-blur-lg">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors ${
              isActive
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-muted-foreground)]"
            }`}
          >
            <item.icon className={`h-5 w-5 transition-transform ${isActive ? "scale-110" : ""}`} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
