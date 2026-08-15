"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { ArrowLeft, Plus, Trash2, MapPin, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";

const tripSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  notes: z.string().optional(),
});

type TripFormData = z.infer<typeof tripSchema>;

interface Stop {
  name: string;
  notes: string;
}

export default function NewTripPage() {
  const router = useRouter();
  const [stops, setStops] = useState<Stop[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
  });

  const onSubmit = async (data: TripFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const payload = {
        ...data,
        stops,
      };

      await api.post("/trips/", payload);
      router.push("/trips");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create trip");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addStop = () => {
    setStops([...stops, { name: "", notes: "" }]);
  };

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const updateStop = (index: number, field: keyof Stop, value: string) => {
    const newStops = [...stops];
    newStops[index] = { ...newStops[index], [field]: value };
    setStops(newStops);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex items-center mb-8 gap-4">
        <Link 
          href="/trips" 
          className="p-2 hover:bg-[var(--color-surface-hover)] rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[var(--color-text)]" />
        </Link>
        <h1 className="text-3xl font-bold text-[var(--color-text)]">Plan a New Trip</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-[var(--color-surface)] p-6 sm:p-8 rounded-2xl shadow-sm border border-[var(--color-border)]">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-sm font-medium text-[var(--color-text-muted)]">Title *</label>
          <input
            {...register("title")}
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
            placeholder="E.g., Summer in Kyoto"
          />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-[var(--color-text-muted)]">Description</label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-none"
            placeholder="What's this trip about?"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[var(--color-text-muted)] flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Start Date
            </label>
            <input
              type="date"
              {...register("start_date")}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[var(--color-text-muted)] flex items-center gap-2">
              <Calendar className="w-4 h-4" /> End Date
            </label>
            <input
              type="date"
              {...register("end_date")}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-[var(--color-text-muted)]">Notes</label>
          <textarea
            {...register("notes")}
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-none"
            placeholder="Any extra notes or reminders?"
          />
        </div>

        <div className="pt-6 border-t border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[var(--color-text)] flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Stops
            </h2>
          </div>

          <div className="space-y-4">
            {stops.map((stop, index) => (
              <div key={index} className="flex gap-4 items-start p-4 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)]">
                <div className="flex-1 space-y-3">
                  <input
                    value={stop.name}
                    onChange={(e) => updateStop(index, "name", e.target.value)}
                    placeholder="Location Name"
                    className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                  />
                  <input
                    value={stop.notes}
                    onChange={(e) => updateStop(index, "notes", e.target.value)}
                    placeholder="Notes for this stop"
                    className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeStop(index)}
                  className="p-2 text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addStop}
              className="w-full py-3 flex items-center justify-center gap-2 text-[var(--color-primary)] font-medium bg-[var(--color-primary-light)] hover:bg-[var(--color-primary)] hover:text-white rounded-xl transition-colors border border-[var(--color-primary)] border-opacity-20 hover:border-opacity-100"
            >
              <Plus className="w-5 h-5" /> Add Stop
            </button>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" /> Creating...
              </>
            ) : (
              "Create Trip"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
