export const theme = {
  colors: {
    primary: '#1E40AF',
    secondary: '#2563EB',
    accent: '#22C55E',
    background: '#F3F4F6',
    textPrimary: '#111827',
    textSecondary: '#374151',
    error: '#DC2626',
  },
  fontFamily: {
    sans: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  },
} as const

export type AppTheme = typeof theme
