import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price level as a string
 * @param priceLevel - The price level (1-4)
 * @param showFree - Whether to show "Free" for level 1 (default: true)
 * @returns Formatted price string
 */
export function formatPrice(priceLevel: 1 | 2 | 3 | 4, showFree: boolean = true): string {
  if (priceLevel === 1 && showFree) {
    return 'Free';
  }
  return '$'.repeat(priceLevel);
}

