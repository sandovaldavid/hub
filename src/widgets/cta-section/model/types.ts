export interface CTAButton {
	id: string;
	icon: string; // Nombre del icono SVG (e.g., 'email', 'briefcase')
	emoji?: string; // Fallback emoji (opcional, deprecated)
	title: string;
	description?: string;
	href: string;
	variant: 'primary' | 'secondary';
	external?: boolean;
}

export interface CTAButtonsProps {
	buttons: CTAButton[];
	layout?: 'horizontal' | 'vertical';
}
