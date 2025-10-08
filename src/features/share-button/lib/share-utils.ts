/**
 * Share Utilities - FSD Layer: features/share-button
 * Business logic for sharing functionality using Web Share API
 */

import type { ShareData, ShareResult } from '../model/types';

/**
 * Check if Web Share API is supported in the current browser
 * @returns true if navigator.share is available
 */
export function isWebShareSupported(): boolean {
	if (typeof navigator === 'undefined') {
		return false;
	}
	return 'share' in navigator && 'canShare' in navigator;
}

/**
 * Get share data for the current page
 * @returns ShareData object with page information
 */
export function getShareData(): ShareData {
	const pageTitle = typeof document !== 'undefined' 
		? document.title 
		: 'DevSandoval - Links Hub';
	
	const pageUrl = typeof window !== 'undefined' 
		? window.location.href 
		: 'https://devsandoval.me';

	return {
		title: pageTitle,
		text: '¡Échale un vistazo a mis links y proyectos! 🚀',
		url: pageUrl,
	};
}

/**
 * Share using the native Web Share API
 * This opens the OS share sheet (Android Share Sheet, iOS Share, Windows Share, etc.)
 * @param data - ShareData to share
 * @returns ShareResult with success status and method used
 */
export async function shareViaWebAPI(data: ShareData): Promise<ShareResult> {
	// Check if Web Share API is supported
	if (!isWebShareSupported()) {
		console.warn('Web Share API not supported in this browser');
		return {
			success: false,
			method: 'none',
			error: 'Web Share API not supported',
		};
	}

	try {
		// Check if the data can be shared
		if (navigator.canShare && !navigator.canShare(data)) {
			console.warn('Cannot share this data');
			return {
				success: false,
				method: 'none',
				error: 'Cannot share this data',
			};
		}

		// Open native OS share dialog
		await navigator.share(data);
		
		return {
			success: true,
			method: 'web-share-api',
		};
	} catch (error) {
		// User cancelled or error occurred
		if (error instanceof Error) {
			// AbortError means user cancelled - not a real error
			if (error.name === 'AbortError') {
				console.log('Share cancelled by user');
				return {
					success: false,
					method: 'web-share-api',
					error: 'User cancelled',
				};
			}
			
			console.error('Error sharing:', error);
			return {
				success: false,
				method: 'none',
				error: error.message,
			};
		}
		
		return {
			success: false,
			method: 'none',
			error: 'Unknown error',
		};
	}
}

/**
 * Fallback: Copy URL to clipboard
 * Used when Web Share API is not available
 * @param text - Text to copy to clipboard
 * @returns ShareResult with success status
 */
export async function copyToClipboard(text: string): Promise<ShareResult> {
	try {
		// Modern Clipboard API
		if (navigator.clipboard && navigator.clipboard.writeText) {
			await navigator.clipboard.writeText(text);
			return {
				success: true,
				method: 'clipboard',
			};
		}

		// Fallback for older browsers
		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.style.position = 'fixed';
		textarea.style.opacity = '0';
		textarea.style.pointerEvents = 'none';
		document.body.appendChild(textarea);
		textarea.select();
		
		const success = document.execCommand('copy');
		document.body.removeChild(textarea);

		if (success) {
			return {
				success: true,
				method: 'clipboard',
			};
		}

		return {
			success: false,
			method: 'none',
			error: 'Failed to copy to clipboard',
		};
	} catch (error) {
		console.error('Error copying to clipboard:', error);
		return {
			success: false,
			method: 'none',
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}

/**
 * Main share function: tries Web Share API first, falls back to clipboard
 * @returns ShareResult with success status and method used
 */
export async function share(): Promise<ShareResult> {
	const shareData = getShareData();

	// Try Web Share API first (native OS share)
	if (isWebShareSupported()) {
		const result = await shareViaWebAPI(shareData);
		
		// If successful or user cancelled, return
		if (result.success || result.error === 'User cancelled') {
			return result;
		}
	}

	// Fallback: copy to clipboard
	console.log('Falling back to clipboard copy');
	return await copyToClipboard(shareData.url);
}
