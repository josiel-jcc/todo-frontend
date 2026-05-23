import path from 'node:path';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginPWA } from 'rsbuild-plugin-pwa';

const envModeArgIndex = process.argv.indexOf('--env-mode');
const isE2E =
  process.env.VITE_E2E === 'true' ||
  (envModeArgIndex !== -1 && process.argv[envModeArgIndex + 1] === 'e2e');

const pwaPlugin = pluginPWA({
  webAppManifest: {
    content: {
      name: 'App de Tarefas',
      short_name: 'Tarefas',
      description: 'Gerencie suas tarefas do dia a dia',
      theme_color: '#0033ad',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      scope: '/',
      icons: [
        {
          src: 'icons/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'icons/icon-maskable-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
  },
  htmlTags: {
    themeColor: true,
    appleTouchIcon: {
      href: '/icons/apple-touch-icon.png',
      sizes: '180x180',
    },
  },
  registerSw: {
    type: 'script',
    autoSkipWaiting: true,
    autoReloadPage: true,
  },
  sw: {
    mode: 'generateSw',
    includeWebAppManifestIcons: true,
    workboxOptions: {
      importScripts: ['/push-sw.js'],
    },
  },
});

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginReact(), ...(isE2E ? [] : [pwaPlugin])],
  server: {
    port: isE2E ? 3100 : undefined,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@docs': path.resolve(__dirname, './docs'),
    },
  },
  tools: {
    rspack: {
      module: {
        rules: [
          {
            test: /\.md$/,
            type: 'asset/source',
          },
        ],
      },
    },
  },
  html: {
    favicon: './public/favicon.svg',
    title: 'App de Tarefas',
    meta: {
      description: 'Gerencie suas tarefas do dia a dia',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'Tarefas',
      'mobile-web-app-capable': 'yes',
    },
  },
});
