import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Textbook } from "@/types/Textbook";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function tbUrl(textbook: Textbook, params?: Record<string, string | number>) {
  const url = `/textbooks/${textbook.baseFileName}`;
  if (!params || Object.keys(params).length === 0) {
    return url;
  }
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value.toString());
  });
  return `${url}?${searchParams.toString()}`;
}
