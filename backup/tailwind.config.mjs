import { gridAreas } from "tailwindcss-grid-areas";

const config = {
    content : [
        './node_modules/onborda/dist/**/*.{js,ts,jsx,tsx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './features/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    plugins: [
        gridAreas(),
    ],
    theme: {
        extend: {
            perspective: {
                '1000': '1000px',
            },
            transformStyle: {
                'preserve-3d': 'preserve-3d',
            },
            backfaceVisibility: {
                'hidden': 'hidden',
            },
            rotate: {
                'y-180': 'rotateY(180deg)',
            },
        },
    },
};
export default config;