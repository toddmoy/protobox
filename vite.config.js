import path from 'path'
import fs from 'fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function startupInfo() {
  const dim = '\x1b[2m'
  const cyan = '\x1b[36m'
  const orange = '\x1b[38;5;208m'
  const reset = '\x1b[0m'
  const bold = '\x1b[1m'

  const banner = `
${orange}   __   __   __  ___  __   __   __
  |__) |__) /  \\  |  /  \\ |__) /  \\ \\_/
  |    |  \\ \\__/  |  \\__/ |__) \\__/ / \\ ${reset}`

  const packages = [
    { name: 'Tailwind CSS', desc: 'Utility-first CSS framework' },
    { name: 'Motion', desc: 'Animation library (Framer Motion)' },
    { name: 'shadcn/ui', desc: '34 pre-installed Radix-based components' },
    { name: 'Lucide React', desc: 'Icon library' },
    { name: 'React Icons', desc: 'Multi-library icon sets (Fi, Fa, Hi, etc.)' },
    { name: 'Leva', desc: 'Runtime control panel for tweaking values' },
    { name: 'Faker', desc: 'Mock data generation' },
    { name: 'React Resizable Panels', desc: 'Draggable split panes' },
  ]

  const hooks = [
    { name: 'usePosition', desc: 'Position elements relative to a target (tooltips, popovers)' },
    { name: 'useTypewriter', desc: 'Typing animation with cursor' },
    { name: 'useToast', desc: 'Toast notifications (shadcn)' },
  ]

  const skills = [
    { name: '/animate', desc: 'Add animations and transitions' },
    { name: '/control-panel', desc: 'Add runtime controls for tweaking values' },
    { name: '/responsive', desc: 'Responsive layout patterns' },
    { name: '/component-demo', desc: 'Create demo pages for components' },
    { name: '/design-notes', desc: 'Scaffold design notes with TOC and canvases' },
    { name: '/impeccable:polish', desc: 'Final quality pass on spacing, alignment' },
    { name: '/impeccable:animate', desc: 'Enhance with micro-interactions' },
    { name: '/impeccable:critique', desc: 'UX evaluation with actionable feedback' },
  ]

  function printSection(title, items) {
    console.log(`\n  ${bold}${cyan}${title}${reset}`)
    for (const item of items) {
      console.log(`    ${dim}${item.name.padEnd(28)}${reset} ${item.desc}`)
    }
  }

  return {
    name: 'startup-info',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        // Scan for hooks dynamically
        const hooksDir = path.resolve(import.meta.dirname, './src/hooks')
        try {
          const hookFiles = fs.readdirSync(hooksDir).filter(f => /^use.*\.(ts|tsx)$/.test(f))
          if (hookFiles.length > hooks.length) {
            // Use static list but note if there are extras
          }
        } catch { /* use static list */ }

        console.log(banner)
        printSection('Packages', packages)
        printSection('Hooks', hooks)
        printSection('Claude Skills', skills)
        console.log()
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [startupInfo(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    outDir: 'build',
  },
  server: {
    allowedHosts: [
      '.lhr.life',
      '.localhost.run',
    ],
  },
})
