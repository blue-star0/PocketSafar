"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Plus, MapPin } from "lucide-react";
import api from "@/lib/api";
import type { DiaryEntry } from "@/types";
import { formatDate } from "@/lib/utils";

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from the API
    // const fetchEntries = async () => {
    //   try {
    //     const res = await api.get("/diary");
    //     setEntries(res.data);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchEntries();
    
    // Simulating API call for empty state demonstration
    setTimeout(() => {
      setEntries([]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">My Travel Diary</h1>
          <p className="text-[var(--color-muted-foreground)] mt-1">Capture your memories and experiences.</p>
        </div>
        <Link
          href="/diary/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-primary-hover)] transition-all hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          New Entry
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-[var(--color-muted)] border border-[var(--color-border)]"></div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] border-dashed">
          <div className="h-16 w-16 bg-[var(--color-muted)] rounded-full flex items-center justify-center mb-6">
            <BookOpen className="h-8 w-8 text-[var(--color-muted-foreground)]" />
          </div>
          <h3 className="text-xl font-bold mb-2">Your diary is empty</h3>
          <p className="text-[var(--color-muted-foreground)] max-w-sm mb-6">Start documenting your travel adventures today. Write about places, people, and feelings.</p>
          <Link
            href="/diary/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-foreground)] px-5 py-2.5 text-sm font-semibold text-[var(--color-background)] shadow-sm hover:bg-[var(--color-muted-foreground)] transition-all"
          >
            Start writing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Entries would map here */}
          {entries.map((entry) => (
            <div key={entry.id} className="group flex flex-col justify-between p-5 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all hover:shadow-lg cursor-pointer">
              <div>
                <div className="flex items-center justify-between mb-3 text-xs text-[var(--color-muted-foreground)]">
                  <span>{formatDate(entry.entry_date)}</span>
                  {entry.is_public && <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">Public</span>}
                </div>
                <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">{entry.title}</h3>
                <p className="text-[var(--color-muted-foreground)] text-sm line-clamp-3 mb-4">{entry.content}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-muted-foreground)]">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{entry.location_name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
