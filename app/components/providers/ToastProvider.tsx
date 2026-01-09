'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
	return (
		<Toaster
			position="bottom-right"
			containerStyle={{
				zIndex: 99999,
			}}
			toastOptions={{
				style: {
					background: 'var(--toast-bg)',
					color: 'var(--toast-foreground)',
					border: '1px solid var(--card-border)',
				},
				success: {
					style: {
						background: 'var(--toast-success-bg)',
						color: 'var(--toast-success-foreground)',
						border: '1px solid var(--toast-success-border)',
					},
				},
				error: {
					style: {
						background: 'var(--toast-error-bg)',
						color: 'var(--toast-error-foreground)',
						border: '1px solid var(--toast-error-border)',
					},
				},
			}}
		/>
	);
}
