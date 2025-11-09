// composables/useApi.ts
import { navigateTo } from "#app";

export default function useApi() {
  const config = useRuntimeConfig()
  const token = useCookie('token')
  
  const apiRequest = async (
    url: string,
    options: any = {}
  ) => {
    const headers = {
      Authorization: token.value ? `Bearer ${token.value}` : '',
      ...options.headers
    }
    
    
    // 👇 Récupérer l'event pour les cookies en SSR
    const event = process.server ? useRequestEvent() : null
    
    // 👇 Forward les cookies en SSR
    if (event && event.node.req.headers.cookie) {
      headers.cookie = event.node.req.headers.cookie
    }
    
    try {
      const data = await $fetch(`${url}`, {
        method: options.method || 'GET',
        body: options.body,
        headers,
        ...options
      })
      
      return data
    } catch (err: any) {
      if (err?.statusCode === 401 || err?.data?.statusCode === 401) {
        navigateTo('/login')
      }
      console.error('API Error:', err)
      return null
    }
  }
  
  return { apiRequest }
}