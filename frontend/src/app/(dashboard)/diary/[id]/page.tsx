"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { ArrowLeft, Edit, Trash2, MapPin, Calendar, Globe, Lock, Star, Loader2, Clock } from 'lucide-react';

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  location_name?: string;
  mood?: string;
  rating?: number;
  entry_date: string;
  is_public: boolean;
  created_at: string;
}

const moodEmojis: Record<string, string> = {
  amazing: '🤩',
  happy: '😊',
  neutral: '😐',
  tired: '😴',
  sad: '😢',
};

export default function DiaryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/diary/${id}`);
        setEntry(response.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load diary entry.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchEntry();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this diary entry? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await api.delete(`/diary/${id}`);
      router.push('/diary');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete entry');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" style={{ color: 'var(--color-primary)' }} />
        <p className="text-lg text-gray-500" style={{ color: 'var(--color-text-muted)' }}>Loading your memory...</p>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl flex flex-col items-center text-center">
          <p className="text-lg font-medium mb-4">{error || 'Entry not found'}</p>
          <Link href="/diary" className="px-6 py-2 bg-white text-red-600 rounded-lg shadow-sm font-medium hover:bg-gray-50 transition-colors">
            Back to Diary
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-8">
        <Link 
          href="/diary" 
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <Link 
            href={`/diary/${id}/edit`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </Link>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <article className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        {/* Entry Meta Header */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-100" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
            <Calendar className="w-4 h-4" />
            {new Date(entry.entry_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          
          {entry.is_public ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
              <Globe className="w-4 h-4" /> Public
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-600 border border-gray-200" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }}>
              <Lock className="w-4 h-4" /> Private
            </span>
          )}

          {entry.mood && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-100" title={`Mood: ${entry.mood}`}>
              <span className="text-lg mr-1">{moodEmojis[entry.mood] || '✨'}</span>
              <span className="capitalize font-medium">{entry.mood}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight" style={{ color: 'var(--color-text)' }}>
          {entry.title}
        </h1>

        {/* Secondary Meta details */}
        <div className="flex flex-wrap gap-6 mb-10 pb-8 border-b border-gray-100" style={{ borderColor: 'var(--color-border)' }}>
          {entry.location_name && (
            <div className="flex items-center gap-2 text-gray-600" style={{ color: 'var(--color-text-muted)' }}>
              <MapPin className="w-5 h-5 text-red-500" />
              <span className="font-medium text-lg">{entry.location_name}</span>
            </div>
          )}
          
          {entry.rating && (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`w-5 h-5 ${star <= (entry.rating || 0) ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-gray-300'}`} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Story Content */}
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600">
          <p className="whitespace-pre-wrap leading-relaxed text-gray-800" style={{ color: 'var(--color-text)' }}>
            {entry.content}
          </p>
        </div>
        
        {/* Footer info */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex items-center text-sm text-gray-400" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
          <Clock className="w-4 h-4 mr-2" />
          Created on {new Date(entry.created_at).toLocaleString()}
        </div>
      </article>
    </div>
  );
}
