/**
 * CivicConnect Design System
 * Bright, civic-minded color palette with blues, greens, and whites
 */

export const colors = {
  // Primary civic colors
  civic: {
    blue: {
      50: '#E8F4FF',
      100: '#D4E9FF',
      200: '#A8D3FF',
      300: '#7DBDFF',
      400: '#51A7FF',
      500: '#2691FF', // Primary civic blue
      600: '#0074E8',
      700: '#0058B3',
      800: '#003D7D',
      900: '#002147',
    },
    green: {
      50: '#E8F8F3',
      100: '#D1F1E7',
      200: '#A3E3CF',
      300: '#75D5B7',
      400: '#47C79F',
      500: '#19B987', // Success/equity green
      600: '#14946C',
      700: '#0F6F51',
      800: '#0A4A36',
      900: '#05251B',
    },
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
  // Semantic colors
  background: '#FFFFFF',
  surface: '#F9FAFB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
  },
  // Map pin colors
  map: {
    candidate: '#2691FF',
    existing: '#6B7280',
    highEquity: '#19B987',
    transit: '#7DBDFF',
    coverage: '#FFB84D',
  },
};

export const spacing = {
  card: '24px',
  section: '48px',
  container: '1280px',
};

export const borderRadius = {
  card: '12px',
  button: '8px',
};

export const shadows = {
  card: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  cardHover: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
};
