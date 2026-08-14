"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  BookOpen,
  Map,
  Users,
  Compass,
  Brain,
  Shield,
  Globe,
  MapPin,
  ArrowRight,
  Menu,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] selection:bg-[var(--color-primary)] selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b border-[var(--color-border)] bg-[var(--color-background)]/80">
        <Link href="/" className="flex items-center gap-2 group">
          <Globe className="h-6 w-6 text-[var(--color-primary)] group-hover:rotate-180 transition-transform duration-700" />
          <span className="text-xl font-bold tracking-tight">PocketSafar</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium hover:text-[var(--color-primary)] transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:text-[var(--color-primary)] transition-colors">How it Works</Link>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="text-sm font-medium hover:text-[var(--color-primary)] transition-colors">Login</Link>
          <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary-hover)] transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.7)] hover:-translate-y-0.5">
            Get Started
          </Link>
        </div>
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button className="p-2 text-[var(--color-foreground)]"><Menu className="h-6 w-6" /></button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center text-center min-h-[90vh] justify-center">
        {/* Animated Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)]/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-secondary)]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Your Smart<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
              Travel Companion
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-[var(--color-muted-foreground)] max-w-2xl mx-auto leading-relaxed">
            Plan trips, write travel diaries, discover local businesses, and explore with AI-powered insights. Your all-in-one travel ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary-hover)] transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2">
              Start Your Journey <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="#features" className="w-full sm:w-auto px-8 py-4 text-base font-bold text-[var(--color-foreground)] border-2 border-[var(--color-border)] rounded-full hover:bg-[var(--color-muted)] transition-all hover:-translate-y-1">
              Learn More
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 mt-20 pt-10 border-t border-[var(--color-border)] w-full max-w-4xl mx-auto flex flex-wrap justify-center gap-12 sm:gap-24 opacity-80">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">10K+</span>
            <span className="text-sm text-[var(--color-muted-foreground)]">Travelers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">50+</span>
            <span className="text-sm text-[var(--color-muted-foreground)]">Countries</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">100K+</span>
            <span className="text-sm text-[var(--color-muted-foreground)]">Entries</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-[var(--color-muted)]/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="px-3 py-1 text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 rounded-full">Features</span>
            <h2 className="mt-4 text-4xl font-bold">Everything you need in one place</h2>
            <p className="mt-4 text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">PocketSafar integrates all aspects of your travel experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Smart Travel Diary", desc: "Document your journeys with rich media, location tagging, and mood tracking." },
              { icon: Map, title: "Trip Planner", desc: "Organize itineraries, budgets, and stops with interactive maps and timelines." },
              { icon: Users, title: "Community Hub", desc: "Share public entries, connect with fellow travelers, and earn badges." },
              { icon: Compass, title: "Business Directory", desc: "Discover local cafes, guides, and services curated by the community." },
              { icon: Brain, title: "AI Assistant", desc: "Get intelligent trip suggestions, packing lists, and local insights instantly." },
              { icon: Shield, title: "Family Safety", desc: "Share live locations, set safe zones, and send SOS alerts for peace of mind." }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all duration-300 hover:shadow-[0_10px_40px_-15px_rgba(99,102,241,0.2)] hover:-translate-y-2">
                <div className="h-12 w-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[var(--color-muted-foreground)] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">How it works</h2>
            <p className="mt-4 text-lg text-[var(--color-muted-foreground)]">Your journey begins in three simple steps.</p>
          </div>
          <div className="relative flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent z-0"></div>
            {[
              { step: "01", title: "Create Account", desc: "Sign up and set your preferences to personalize your travel experience." },
              { step: "02", title: "Plan & Explore", desc: "Use the trip planner and AI assistant to build your perfect itinerary." },
              { step: "03", title: "Share & Connect", desc: "Log your diary entries, upload photos, and connect with other travelers." }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex-1 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-[var(--color-card)] border-4 border-[var(--color-background)] shadow-xl flex items-center justify-center text-2xl font-bold text-[var(--color-primary)] mb-6">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-[var(--color-muted-foreground)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to explore the world?</h2>
          <p className="text-xl text-indigo-200 mb-10">Join thousands of travelers who are already using PocketSafar to document their adventures.</p>
          <Link href="/register" className="inline-block px-10 py-5 text-lg font-bold text-[#0f172a] bg-white rounded-full hover:bg-gray-100 transition-all shadow-xl hover:scale-105">
            Join PocketSafar Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[var(--color-border)] bg-[var(--color-background)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Globe className="h-6 w-6 text-[var(--color-primary)]" />
              <span className="text-xl font-bold">PocketSafar</span>
            </Link>
            <p className="text-[var(--color-muted-foreground)] max-w-xs">Your all-in-one travel ecosystem for planning, exploring, and connecting.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-3 text-[var(--color-muted-foreground)]">
              <li><Link href="#features" className="hover:text-[var(--color-primary)]">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-[var(--color-primary)]">How it Works</Link></li>
              <li><Link href="/login" className="hover:text-[var(--color-primary)]">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-3 text-[var(--color-muted-foreground)]">
              <li><Link href="#" className="hover:text-[var(--color-primary)]">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[var(--color-primary)]">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-[var(--color-primary)]">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-[var(--color-border)] text-center text-[var(--color-muted-foreground)] text-sm">
          &copy; {new Date().getFullYear()} PocketSafar. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
