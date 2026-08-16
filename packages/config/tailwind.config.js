module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f8',
          100: '#dbe3ed',
          200: '#b8c9db',
          500: '#1b365d', // Deep Navy
          600: '#152b4a',
          700: '#0f1f37',
        },
        secondary: {
          500: '#2563eb', // Blue
        },
        success: {
          500: '#22c55e', // Green
        },
        warning: {
          500: '#f59e0b', // Amber
        },
        error: {
          500: '#ef4444', // Red
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          500: '#6b7280',
          700: '#374151',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
