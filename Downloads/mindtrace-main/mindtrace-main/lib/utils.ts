import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── Tailwind Class Utility ───────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Mood Score Helpers ───────────────────────────────────────────────────────
export function getMoodColor(score: number): string {
  if (score >= 8) return "text-green-600";
  if (score >= 6) return "text-lime-600";
  if (score >= 4) return "text-amber-600";
  if (score >= 2) return "text-orange-600";
  return "text-red-600";
}

export function getMoodBg(score: number): string {
  if (score >= 8) return "bg-green-50 border-green-200";
  if (score >= 6) return "bg-lime-50 border-lime-200";
  if (score >= 4) return "bg-amber-50 border-amber-200";
  if (score >= 2) return "bg-orange-50 border-orange-200";
  return "bg-red-50 border-red-200";
}

export function getMoodHex(score: number): string {
  if (score >= 8) return "#16a34a";
  if (score >= 6) return "#65a30d";
  if (score >= 4) return "#d97706";
  if (score >= 2) return "#ea580c";
  return "#dc2626";
}

export function getTrend(scores: number[]): "improving" | "declining" | "stable" {
  if (scores.length < 3) return "stable";
  const recent = scores.slice(0, Math.floor(scores.length / 2));
  const older = scores.slice(Math.floor(scores.length / 2));
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
  if (recentAvg - olderAvg > 0.5) return "improving";
  if (olderAvg - recentAvg > 0.5) return "declining";
  return "stable";
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
