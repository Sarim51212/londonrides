/** Design tokens from DESIGN.md — "Obsidian & Gold Executive Chauffeur". */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070b16',
          900: '#090e1c', // surface-container-lowest
          850: '#0e1321', // surface / background
          800: '#161b2a', // surface-container-low
          750: '#1a1f2e', // surface-container
          700: '#252a39', // surface-container-high
          600: '#303444', // surface-container-highest
          500: '#343948', // surface-bright
        },
        obsidian: { DEFAULT: '#0F172A', elevated: '#1E293B' },
        gold: {
          DEFAULT: '#D4AF37', // primary-container — champagne gold
          bright: '#F2CA50', // primary
          soft: '#E5C378', // secondary
          pale: '#FFE088', // primary-fixed
          muted: '#C5A059', // brass-muted
          deep: '#735C00',
        },
        cream: '#dee2f6', // on-surface
        sand: '#d0c5af', // on-surface-variant
        slatey: '#94A3B8', // tertiary metadata
        star: '#EAA500',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'label-caps': ['11px', { lineHeight: '16px', letterSpacing: '0.12em', fontWeight: '700' }],
      },
      borderColor: { hairline: 'rgba(229, 195, 120, 0.16)' },
      boxShadow: {
        glow: '0 0 0 1px #D4AF37, 0 8px 30px rgba(212, 175, 55, 0.15)',
        elevated: '0 20px 48px -8px rgba(0, 0, 0, 0.7), 0 0 24px 0 rgba(212, 175, 55, 0.08)',
        gold: '0 10px 30px -8px rgba(212, 175, 55, 0.55)',
      },
      maxWidth: { site: '1280px' },
      keyframes: {
        shimmer: { '0%': { transform: 'translateX(-120%) skewX(-20deg)' }, '100%': { transform: 'translateX(220%) skewX(-20deg)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        'scroll-dot': { '0%': { transform: 'translateY(0)', opacity: 1 }, '80%': { transform: 'translateY(14px)', opacity: 0 }, '100%': { opacity: 0 } },
      },
      animation: {
        shimmer: 'shimmer 2.8s ease-in-out infinite',
        marquee: 'marquee 45s linear infinite',
        float: 'float 5s ease-in-out infinite',
        'scroll-dot': 'scroll-dot 1.8s ease-out infinite',
      },
    },
  },
  plugins: [],
};
