/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                accent: {
                    purple: '#8B5CF6',
                    pink: '#EC4899',
                    softPurple: '#F5F3FF',
                    softPink: '#FDF2F8',
                },
                white: '#FFFFFF',
                black: '#1A1A1A',
                "illustration-bg": '#FAFAFA',
            },
            borderWidth: {
                '3': '3px',
                '4': '4px',
                '5': '5px',
            },
            boxShadow: {
                'flat': '4px 4px 0px 0px #000000',
                'flat-hover': '6px 6px 0px 0px #000000',
                'flat-sm': '2px 2px 0px 0px #000000',
                'flat-purple': '4px 4px 0px 0px #8B5CF6',
                'flat-pink': '4px 4px 0px 0px #EC4899',
                'eddie-card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
                'eddie-card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                'eddie-elevated': '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                'btn-primary': '0 10px 15px -3px rgba(124, 58, 237, 0.3)',
            },
            fontFamily: {
                'display': ['"Syne"', 'sans-serif'],
                'header': ['"Space Grotesk"', 'sans-serif'],
                'soft': ['"Outfit"', 'sans-serif'],
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
                '30': '7.5rem',
                '128': '32rem',
                '144': '36rem',
            },
            borderRadius: {
                '4xl': '2.5rem',
                '5xl': '3.5rem',
                '6xl': '4.5rem',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
