"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Map, Plus, Calendar, Navigation } from "lucide-react";
import api from "@/lib/api";
import type { Trip } from "@/types";
import { formatDate } from "@/lib/utils";

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call for empty state demonstration
    setTimeout(() => {
      setTrips([]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">My Trips</h1>
          <p className="text-[var(--color-muted-foreground)] mt-1">Plan, manage, and track your itineraries.</p>
        </div>
        <Link
          href="/trips/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-primary-hover)] transition-all hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Plan a Trip
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-[var(--color-muted)] border border-[var(--color-border)]"></div>
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] border-dashed">
          <div className="h-16 w-16 bg-[var(--color-muted)] rounded-full flex items-center justify-center mb-6">
            <Map className="h-8 w-8 text-[var(--color-muted-foreground)]" />
          </div>
          <h3 className="text-xl font-bold mb-2">No trips planned</h3>
          <p className="text-[var(--color-muted-foreground)] max-w-sm mb-6">Organize your next adventure. Set budgets, plan stops, and keep everything in one place.</p>
          <Link
            href="/trips/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-foreground)] px-5 py-2.5 text-sm font-semibold text-[var(--color-background)] shadow-sm hover:bg-[var(--color-muted-foreground)] transition-all"
          >
            Start planning
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trips.map((trip) => (
            <div key={trip.id} className="group p-6 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all hover:shadow-lg cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold group-hover:text-[var(--color-primary)] transition-colors">{trip.title}</h3>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                  trip.status === 'active' ? 'bg-green-500/10 text-green-500' :
                  trip.status === 'completed' ? 'bg-blue-500/10 text-blue-500' :
                  'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                </span>
              </div>
              
              {trip.description && <p className="text-[var(--color-muted-foreground)] text-sm mb-5 line-clamp-2">{trip.description}</p>}
              
              <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
                  <Calendar className="h-4 w-4 text-[var(--color-primary)]" />
                  <span>{formatDate(trip.start_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
                  <Navigation className="h-4 w-4 text-[var(--color-secondary)]" />
                  <span>{trip.stops?.length || 0} stops</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
