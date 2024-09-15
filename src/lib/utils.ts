import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add any shared utility functions here
export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

// Add more utility functions as needed
