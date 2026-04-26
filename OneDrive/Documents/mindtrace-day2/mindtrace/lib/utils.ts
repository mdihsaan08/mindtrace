import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function getTrend(scores: number[]): "improving"|"declining"|"stable" {
  if (scores.length < 3) return "stable";
  const half = Math.floor(scores.length / 2);
  const r = scores.slice(0, half).reduce((a,b)=>a+b,0)/half;
  const o = scores.slice(half).reduce((a,b)=>a+b,0)/(scores.length-half);
  if (r-o > 0.5) return "improving"; if (o-r > 0.5) return "declining"; return "stable";
}
export function formatDate(date: Date|string): string {
  return new Date(date).toLocaleDateString("en-US",{ weekday:"short", month:"short", day:"numeric", year:"numeric" });
}
export function formatShortDate(date: Date|string): string {
  return new Date(date).toLocaleDateString("en-US",{ month:"short", day:"numeric" });
}
