import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss()],
  },

  css: ["./app/tailwind.css"],
  modules: [
    "@sidebase/nuxt-auth",
    "@prisma/nuxt",
    "nuxt-lucide-icons",
    "nuxt-shiki",
  ],
  auth: {
    provider: {
      type: 'authjs',
      trustHost: false,
      defaultProvider: 'github',
      addDefaultCallbackUrl: true
    }
  },
})