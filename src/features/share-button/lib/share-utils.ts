interface ShareData {
	title: string;
	text: string;
	url: string;
}

interface ShareResult {
	success: boolean;
	method: 'web-share-api' | 'clipboard' | 'none';
	error?: string;
}

export function isWebShareSupported(): boolean {
	if (typeof navigator === 'undefined') return false;
	return typeof navigator.share === 'function';
}

export function getShareData(text: string): ShareData {
	const pageTitle = typeof document !== 'undefined' ? document.title : '';
	const pageUrl =
		typeof window !== 'undefined' ? window.location.href : 'https://hub.sandovaldavid.com';
	return { title: pageTitle, text, url: pageUrl };
}

export async function shareViaWebAPI(data: ShareData): Promise<ShareResult> {
	if (!isWebShareSupported()) {
		return { success: false, method: 'none', error: 'Web Share API not supported' };
	}

	try {
		if (typeof navigator.canShare === 'function' && !navigator.canShare(data)) {
			return { success: false, method: 'none', error: 'Cannot share this data' };
		}
		await navigator.share(data);
		return { success: true, method: 'web-share-api' };
	} catch (error) {
		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				return { success: false, method: 'web-share-api', error: 'User cancelled' };
			}
			console.error('Error sharing:', error);
			return { success: false, method: 'none', error: error.message };
		}
		return { success: false, method: 'none', error: 'Unknown error' };
	}
}

export async function copyToClipboard(text: string): Promise<ShareResult> {
	if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
		return { success: false, method: 'none', error: 'Clipboard API not supported' };
	}

	try {
		await navigator.clipboard.writeText(text);
		return { success: true, method: 'clipboard' };
	} catch (error) {
		console.error('Error copying to clipboard:', error);
		return {
			success: false,
			method: 'none',
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}

export async function share(text: string): Promise<ShareResult> {
	const shareData = getShareData(text);
	if (isWebShareSupported()) {
		const result = await shareViaWebAPI(shareData);
		if (result.success || result.error === 'User cancelled') return result;
	}
	return copyToClipboard(shareData.url);
}
