/**
 * ShareButton Feature - FSD Layer: features/share-button
 * Public API exports
 */

// Component
export { default as ShareButton } from './ui/ShareButton.astro';

// Types
export type { ShareButtonProps, ShareData, ShareResult } from './model/types';

// Utilities (if needed externally)
export { 
	isWebShareSupported, 
	shareViaWebAPI, 
	copyToClipboard, 
	getShareData,
	share 
} from './lib/share-utils';
