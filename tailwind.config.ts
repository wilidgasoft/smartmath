import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          light: '#DBEAFE',
        },
        // Success (correct answers)
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
        },
        // Warning (wrong answers - amber, not red)
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
        },
        // Space backgrounds
        space: {
          DEFAULT: '#0F172A',
          card: '#1E293B',
          overlay: 'rgba(0,0,0,0.6)',
        },
        // Galaxy themes
        galaxy1: {
          primary: '#1E40AF',
          secondary: '#F59E0B',
          accent: '#06B6D4',
          bg: '#0F172A',
        },
        galaxy2: {
          primary: '#7C3AED',
          secondary: '#EC4899',
          accent: '#8B5CF6',
          bg: '#1E1B4B',
        },
        galaxy3: {
          primary: '#F59E0B',
          secondary: '#EF4444',
          accent: '#10B981',
          bg: '#1C1917',
        },
        galaxy4: {
          primary: '#3B82F6',
          secondary: '#A855F7',
          accent: '#F472B6',
          bg: '#020617',
        },
        // Streaks
        streak: {
          3: '#F97316',
          5: '#EF4444',
          10: '#A855F7',
        },
        // Stars
        star: {
          filled: '#FBBF24',
          empty: '#475569',
        },
      },
      fontFamily: {
        heading: ['var(--font-fredoka)', 'Nunito', 'system-ui', 'sans-serif'],
        body: ['var(--font-nunito)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shoot': 'shoot 1s ease-in forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shoot: {
          '0%': { transform: 'translateX(0) translateY(0)', opacity: '1' },
          '100%': { transform: 'translateX(200px) translateY(-200px)', opacity: '0' },
        },
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(to bottom, #0F172A, #1E1B4B)',
        'galaxy2-gradient': 'linear-gradient(to bottom, #1E1B4B, #0F172A)',
        'galaxy3-gradient': 'linear-gradient(to bottom, #1C1917, #0F172A)',
        'galaxy4-gradient': 'linear-gradient(to bottom, #020617, #0F172A)',
      },
    },
  },
  plugins: [],
};

export default config;
