import type { DashboardFilterState } from "./actions"

// This is a mock in-memory database.
// In a real application, you would use a persistent database like Supabase, Neon, or Vercel KV.
const sharedDashboards = new Map<string, DashboardFilterState>()

// Generates a random, URL-friendly key
const generateKey = () => Math.random().toString(36).substring(2, 12)

export const db = {
  createSharedDashboard: async (filters: DashboardFilterState): Promise<string> => {
    const key = generateKey()
    sharedDashboards.set(key, filters)
    console.log(`[DB Mock] Saved dashboard with key: ${key}`, filters)
    return key
  },
  getSharedDashboard: async (key: string): Promise<DashboardFilterState | null> => {
    const filters = sharedDashboards.get(key)
    console.log(`[DB Mock] Fetched dashboard with key: ${key}`, filters)
    return filters || null
  },
}
