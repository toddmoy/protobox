// Zinnia + Vite shims. Merge these blocks into the project's vite.config.js.
// The export must be a function of ({ mode }) so `mode` is available to `define`.

export default defineConfig(({ mode }) => ({
  plugins: [/* ...existing plugins (react, tailwindcss, etc.)... */],

  // Fixes: "process is not defined" thrown from @zapier/design-system
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },

  resolve: {
    // Fixes: "Invalid hook call" / "Cannot read properties of null (reading 'useMemo')"
    // caused by a second copy of React from linked @zapier packages.
    dedupe: ['react', 'react-dom', 'react-aria', 'react-aria-components'],
    alias: {
      '@': path.resolve(import.meta.dirname, './src'), // keep existing alias
      react: path.resolve(import.meta.dirname, './node_modules/react'),
      'react-dom': path.resolve(import.meta.dirname, './node_modules/react-dom'),
    },
  },

  optimizeDeps: {
    include: [
      '@zapier/design-system',
      '@zapier/design-tokens',
      '@zapier/zinnia-icons',
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
    ],
  },

  // For @zapier/design-system SCSS
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
}))
