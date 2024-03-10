import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  base: 'demo',
  outDir: '../demo',
  integrations: [tailwind()]
});