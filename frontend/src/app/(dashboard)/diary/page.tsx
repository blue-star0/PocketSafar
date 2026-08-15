"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Plus, MapPin, Star, Lock, Globe } from "lucide-react";
import api from "@/lib/api";
import type { DiaryEntry } from "@/types";
import { formatDate } from "@/lib/utils";

const moodEmoji: Record<string, string> = {
  amazing: "🤩",
  happy: "😊",
  neutral: "😐",
  tired: "😴",
  sad: "😢",
};

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await api.get<DiaryEntry[]>("/diary/");
        setEntries(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load diary entries.");
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">My Travel Diary</h1>
          <p className="text-[var(--color-muted-foreground)] mt-1">
            {entries.length > 0 ? `${entries.length} entr${entries.length === 1 ? "y" : "ies"}` : "Capture your memories and experiences."}
          </p>
        </div>
        <Link
          href="/diary/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-primary-hover)] transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          New Entry
        </Link>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-56 rounded-2xl bg-[var(--color-muted)] border border-[var(--color-border)]"></div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] border-dashed">
          <div className="h-16 w-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mb-6">
            <BookOpen className="h-8 w-8 text-[var(--color-primary)]" />
          </div>
          <h3 className="text-xl font-bold mb-2">Your diary is empty</h3>
          <p className="text-[var(--color-muted-foreground)] max-w-sm mb-6">
            Start documenting your travel adventures. Write about places, people, and feelings.
          </p>
          <Link
            href="/diary/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)] transition-all"
          >
            <Plus className="h-4 w-4" />
            Write First Entry
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              href={`/diary/${entry.id}`}
              className="group flex flex-col justify-between p-5 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs text-[var(--color-muted-foreground)]">
                  <span>{formatDate(entry.entry_date)}</span>
                  <div className="flex items-center gap-2">
                    {entry.mood && <span title={entry.mood}>{moodEmoji[entry.mood] || "🙂"}</span>}
                    {entry.is_public ? (
                      <Globe className="h-3.5 w-3.5 text-green-500" title="Public" />
                    ) : (
                      <Lock className="h-3.5 w-3.5" title="Private" />
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
                  {entry.title}
                </h3>
                <p className="text-[var(--color-muted-foreground)] text-sm line-clamp-3 mb-4">
                  {entry.content}
                </p>
              </div>
              <div className="flex items-center justify-between">
                {entry.location_name && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-muted-foreground)]">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[120px]">{entry.location_name}</span>
                  </div>
                )}
                {entry.rating && (
                  <div className="flex items-center gap-0.5 text-xs text-amber-500 ml-auto">
                    <Star className="h-3.5 w-3.5 fill-amber-500" />
                    <span>{entry.rating}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
