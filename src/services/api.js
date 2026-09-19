import axios from 'axios'

const localApiUrl = 'http://localhost:3002/api'
const productionFallbackUrl = '/api'

const isLocalHost =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)

const apiBaseUrl =
  import.meta.env.VITE_API_URL || (isLocalHost ? localApiUrl : productionFallbackUrl)

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})
