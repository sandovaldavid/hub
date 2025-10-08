/**
 * ShareButton Types - FSD Layer: features/share-button
 * Type definitions for sharing functionality
 */

/**
 * Data structure for Web Share API
 */
export interface ShareData {
	title: string;
	text: string;
	url: string;
}

/**
 * ShareButton component props
 */
export interface ShareButtonProps {
	/**
	 * Position of the button on screen
	 * @default 'top-left'
	 */
	position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

	/**
	 * Visual variant
	 * @default 'floating'
	 */
	variant?: 'floating' | 'inline';

	/**
	 * Button size
	 * @default 'md'
	 */
	size?: 'sm' | 'md' | 'lg';

	/**
	 * Show text label next to icon
	 * @default false
	 */
	showLabel?: boolean;

	/**
	 * Custom CSS classes
	 */
	class?: string;
}

/**
 * Share operation result
 */
export interface ShareResult {
	success: boolean;
	method: 'web-share-api' | 'clipboard' | 'none';
	error?: string;
}
