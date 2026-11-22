import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite';
import { federation } from '@module-federation/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    federation({
      name :"Admin",
      filename :"remoteEntry.js",
      exposes : {
        "./App" : "./src/App.tsx"
      },
      shared :["react", "react-dom"]
    })
  ],
})
