import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function getMoodColor(score: number): string {
  if (score >= 8) return "text-green-700";
  if (score >= 6) return "text-lime-700";
  if (score >= 4) return "text-amber-700";
  if (score >= 2) return "text-orange-700";
  return "text-red-700";
}

export function getMoodBg(score: number): string {
  if (score >= 8) return "bg-green-50 border-green-200";
  if (score >= 6) return "bg-lime-50 border-lime-200";
  if (score >= 4) return "bg-amber-50 border-amber-200";
  if (score >= 2) return "bg-orange-50 border-orange-200";
  return "bg-red-50 border-red-200";
}

export function getMoodHex(score: number): string {
  if (score >= 8) return "#524660";
  if (score >= 6) return "#705858";
  if (score >= 4) return "#9F8383";
  if (score >= 2) return "#CEAEB0";
  return "#FDDCB0";
}

export function getTrend(scores: number[]): "improving" | "declining" | "stable" {
  if (scores.length < 3) return "stable";
  const half = Math.floor(scores.length / 2);
  const recentAvg = scores.slice(0, half).reduce((a, b) => a + b, 0) / half;
  const olderAvg  = scores.slice(half).reduce((a, b) => a + b, 0) / (scores.length - half);
  if (recentAvg - olderAvg >  0.5) return "improving";
  if (olderAvg  - recentAvg > 0.5) return "declining";
  return "stable";
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export function formatShortDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
