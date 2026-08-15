"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { ArrowLeft, Save, MapPin, Smile, Star, Globe, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';

const moodOptions = [
  { value: 'amazing', emoji: '🤩', label: 'Amazing' },
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'tired', emoji: '😴', label: 'Tired' },
  { value: 'sad', emoji: '😢', label: 'Sad' }
];

const diarySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  location_name: z.string().optional(),
  mood: z.enum(['amazing', 'happy', 'neutral', 'tired', 'sad']).optional(),
  rating: z.number().min(1).max(5).optional(),
  entry_date: z.string().optional(),
  is_public: z.boolean(),
});

type DiaryFormValues = z.infer<typeof diarySchema>;

export default function NewDiaryEntryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<DiaryFormValues>({
    resolver: zodResolver(diarySchema),
    defaultValues: {
      title: '',
      content: '',
      location_name: '',
      mood: 'happy',
      rating: 5,
      entry_date: new Date().toISOString().split('T')[0],
      is_public: false,
    },
  });

  const onSubmit = async (data: DiaryFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.post('/diary/', data);
      router.push('/diary');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create diary entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/diary" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" style={{ color: 'var(--color-text)' }} />
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>New Diary Entry</h1>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          {/* Title */}
          <div>
            <input
              {...form.register('title')}
              type="text"
              placeholder="What's the title of this memory?"
              className="w-full text-3xl font-bold bg-transparent border-0 border-b-2 border-transparent hover:border-gray-100 focus:border-blue-500 focus:ring-0 px-0 py-2 placeholder-gray-300 transition-colors"
              style={{ color: 'var(--color-text)' }}
            />
            {form.formState.errors.title && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Date & Location */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Date</label>
              <input
                {...form.register('entry_date')}
                type="date"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...form.register('location_name')}
                  type="text"
                  placeholder="Where did this happen?"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                />
              </div>
            </div>
          </div>

          {/* Mood & Rating */}
          <div className="flex flex-wrap gap-8 py-4 border-y border-gray-100" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <label className="block text-sm font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
                <Smile className="w-4 h-4" /> How were you feeling?
              </label>
              <div className="flex gap-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => form.setValue('mood', mood.value as any)}
                    className={`p-3 rounded-xl text-2xl transition-all ${
                      form.watch('mood') === mood.value
                        ? 'bg-blue-50 border-2 border-blue-500 scale-110 shadow-sm'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 grayscale hover:grayscale-0'
                    }`}
                    title={mood.label}
                  >
                    {mood.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
                <Star className="w-4 h-4" /> Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => form.setValue('rating', star)}
                    className="p-2 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (form.watch('rating') || 0) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-transparent text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <textarea
              {...form.register('content')}
              placeholder="Write your story here..."
              className="w-full min-h-[300px] p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y text-lg"
              style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
            {form.formState.errors.content && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.content.message}</p>
            )}
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50" style={{ backgroundColor: 'var(--color-background)' }}>
            <div>
              <h3 className="font-medium flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                {form.watch('is_public') ? <Globe className="w-4 h-4 text-blue-500" /> : <Lock className="w-4 h-4 text-gray-500" />}
                {form.watch('is_public') ? 'Public Entry' : 'Private Entry'}
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                {form.watch('is_public') 
                  ? 'Anyone can see this entry if they visit your profile.'
                  : 'Only you can see this entry.'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                {...form.register('is_public')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Link
            href="/diary"
            className="px-6 py-3 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
            style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </button>
        </div>
      </form>
    </div>
  );
}
