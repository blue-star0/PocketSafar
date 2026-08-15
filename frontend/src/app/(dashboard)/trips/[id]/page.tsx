"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Trash2, Edit, Loader2 } from "lucide-react";

interface Stop {
  id: number;
  name: string;
  notes: string;
  order: number;
}

interface Trip {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  notes: string;
  status: string;
  stops: Stop[];
}

export default function TripDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await api.get(`/trips/${id}`);
        setTrip(response.data);
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Failed to load trip details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTrip();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    
    try {
      setIsDeleting(true);
      await api.delete(`/trips/${id}`);
      router.push("/trips");
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to delete trip");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-6 text-center">
          <p className="text-lg mb-4">{error || "Trip not found"}</p>
          <Link href="/trips" className="text-[var(--color-primary)] hover:underline font-medium">
            &larr; Back to Trips
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/trips" 
            className="p-2 hover:bg-[var(--color-surface)] rounded-full transition-colors border border-transparent hover:border-[var(--color-border)]"
          >
            <ArrowLeft className="w-6 h-6 text-[var(--color-text)]" />
          </Link>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">{trip.title}</h1>
          <span className="px-3 py-1 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full text-sm font-semibold capitalize border border-[var(--color-primary)] border-opacity-20">
            {trip.status || "Planned"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="px-4 py-2 flex items-center gap-2 bg-[var(--color-surface)] hover:bg-[var(--color-border)] text-[var(--color-text)] rounded-xl font-medium transition-colors border border-[var(--color-border)]"
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-colors border border-red-100 disabled:opacity-50"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete
          </button>
        </div>
      </div>

      {/* Main Info */}
      <div className="bg-[var(--color-surface)] rounded-2xl p-6 sm:p-8 shadow-sm border border-[var(--color-border)] space-y-6">
        {trip.description && (
          <div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-2">Description</h3>
            <p className="text-[var(--color-text)] text-lg leading-relaxed">{trip.description}</p>
          </div>
        )}

        {(trip.start_date || trip.end_date) && (
          <div className="flex items-center gap-3 text-[var(--color-text)] bg-[var(--color-background)] px-4 py-3 rounded-xl inline-flex border border-[var(--color-border)]">
            <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="font-medium">
              {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'TBD'} 
              {' - '} 
              {trip.end_date ? new Date(trip.end_date).toLocaleDateString() : 'TBD'}
            </span>
          </div>
        )}

        {trip.notes && (
          <div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-2">Notes</h3>
            <div className="bg-[#FFF9C4] dark:bg-[#5D4037] p-4 rounded-xl text-[var(--color-text)]">
              {trip.notes}
            </div>
          </div>
        )}
      </div>

      {/* Stops */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2 px-2">
          <MapPin className="w-6 h-6 text-[var(--color-primary)]" /> Itinerary Stops
        </h2>
        
        {trip.stops && trip.stops.length > 0 ? (
          <div className="space-y-4">
            {trip.stops.map((stop, index) => (
              <div 
                key={stop.id || index} 
                className="flex gap-4 p-5 bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:border-opacity-50 transition-all group"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-[var(--color-text)] mb-1">{stop.name}</h4>
                  {stop.notes && (
                    <p className="text-[var(--color-text-muted)]">{stop.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border)]">
            <MapPin className="w-12 h-12 text-[var(--color-border)] mx-auto mb-3" />
            <p className="text-[var(--color-text-muted)] font-medium">No stops planned yet for this trip.</p>
          </div>
        )}
      </div>
    </div>
  );
}
