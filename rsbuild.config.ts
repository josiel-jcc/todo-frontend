import path from 'node:path';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginPWA } from 'rsbuild-plugin-pwa';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [
    pluginReact(),
    pluginPWA({
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
      },
    }),
  ],
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
