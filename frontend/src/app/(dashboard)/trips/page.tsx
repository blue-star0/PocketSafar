"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Map, Plus, Calendar, Navigation, Clock } from "lucide-react";
import api from "@/lib/api";
import type { Trip } from "@/types";
import { formatDate } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  planning: "bg-yellow-500/10 text-yellow-500",
  active: "bg-green-500/10 text-green-500",
  completed: "bg-blue-500/10 text-blue-500",
  cancelled: "bg-red-500/10 text-red-500",
};

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get<Trip[]>("/trips/");
        setTrips(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load trips.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">My Trips</h1>
          <p className="text-[var(--color-muted-foreground)] mt-1">
            {trips.length > 0 ? `${trips.length} trip${trips.length === 1 ? "" : "s"} planned` : "Plan, manage, and track your itineraries."}
          </p>
        </div>
        <Link
          href="/trips/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-primary-hover)] transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          Plan a Trip
        </Link>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-[var(--color-muted)] border border-[var(--color-border)]"></div>
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] border-dashed">
          <div className="h-16 w-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mb-6">
            <Map className="h-8 w-8 text-[var(--color-primary)]" />
          </div>
          <h3 className="text-xl font-bold mb-2">No trips planned yet</h3>
          <p className="text-[var(--color-muted-foreground)] max-w-sm mb-6">
            Organize your next adventure. Set dates, plan stops, and keep everything in one place.
          </p>
          <Link
            href="/trips/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)] transition-all"
          >
            <Plus className="h-4 w-4" />
            Plan First Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trips.map((trip) => (
            <Link
              key={trip.id}
              href={`/trips/${trip.id}`}
              className="group p-6 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold group-hover:text-[var(--color-primary)] transition-colors line-clamp-1 flex-1 mr-3">
                  {trip.title}
                </h3>
                <span className={`shrink-0 px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${statusStyles[trip.status] || statusStyles.planning}`}>
                  {trip.status}
                </span>
              </div>

              {trip.description && (
                <p className="text-[var(--color-muted-foreground)] text-sm mb-4 line-clamp-2">
                  {trip.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4 mt-auto pt-3 border-t border-[var(--color-border)]">
                {trip.start_date && (
                  <div className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)]">
                    <Calendar className="h-4 w-4 text-[var(--color-primary)]" />
                    <span>{formatDate(trip.start_date)}</span>
                  </div>
                )}
                {trip.end_date && (
                  <div className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)]">
                    <Clock className="h-4 w-4 text-[var(--color-secondary)]" />
                    <span>{formatDate(trip.end_date)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)] ml-auto">
                  <Navigation className="h-4 w-4" />
                  <span>{trip.stops?.length || 0} stop{(trip.stops?.length || 0) !== 1 ? "s" : ""}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
