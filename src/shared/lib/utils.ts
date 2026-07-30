/**
 * Shared Utilities - FSD Layer: shared/lib
 * Reusable helper functions used across the application
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper conflict resolution
 * Combines clsx for conditional classes + tailwind-merge for deduplication
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-button-primary-background', 'px-6')
 * // Result: 'py-2 bg-button-primary-background px-6' (px-4 removed, px-6 wins)
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

/**
 * Copy text to clipboard
 *
 * @param text - Text to copy
 * @returns Promise that resolves when copied successfully
 *
 * @example
 * await copyToClipboard('https://devsandoval.com');
 */
export async function copyToClipboard(text: string): Promise<void> {
	if (typeof navigator === 'undefined' || !navigator.clipboard) {
		throw new Error('Clipboard API not available');
	}

	await navigator.clipboard.writeText(text);
}
