/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/ui/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			animation: {
				'background-shine': 'background-shine 2s linear infinite',
			},
			keyframes: {
				'background-shine': {
					'from': {
						'backgroundPosition': '0 0',
					},
					'to': {
						'backgroundPosition': '-200% 0',
					},
				},
			},
		},
	},
	plugins: [require('daisyui'), require('tailwindcss-animate')],
	daisyui: {
		themes: [
			{
				myTheme: {
					'primary': 'oklch(62.37% 0.244 308.5)',
					'primary-content': 'oklch(90% 0 0)',
					'secondary': 'oklch(67.61% 0.2 20.57)',
					'accent': 'oklch(66.65% 0.177 249.59)',
					'accent-content': 'oklch(100% 0 0)',
					'neutral': '#222222',
					'base-100': 'oklch(15% 0 0)',
					'base-200': 'oklch(20% 0 0)',
					'base-300': 'oklch(25% 0 0)',
					'base-content': 'oklch(80% 0 0)',
					'info': 'hsl(158 100% 50%)',
					'success': 'hsl(158 100% 50%)',
					'warning': 'hsl(39 100% 50%)',
					'error': 'hsl(347 100% 50%)',
					'--rounded-box': '0.5rem',
					'--rounded-btn': '0.25rem',
				},
			},
		],
	},
}
