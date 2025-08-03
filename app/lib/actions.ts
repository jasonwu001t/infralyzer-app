"use server"

import { z } from "zod"
import { db } from "./db"

// Define the shape of our filter state
const FilterStateSchema = z.object({
  dateRange: z.string(),
  granularity: z.string(),
  costType: z.string(),
  accounts: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  regions: z.array(z.string()).optional(),
  tags: z.record(z.array(z.string())).optional(),
  costThreshold: z.object({
    min: z.number().optional(),
    max: z.number().optional()
  }).optional(),
  comparisonMode: z.boolean().optional(),
  comparisonPeriod: z.object({
    primary: z.string(),
    secondary: z.string()
  }).optional()
})

export type DashboardFilterState = z.infer<typeof FilterStateSchema>

export async function generateShareLink(filters: DashboardFilterState) {
  try {
    const validatedFilters = FilterStateSchema.parse(filters)
    const key = await db.createSharedDashboard(validatedFilters)

    if (!key) {
      return { success: false, error: "Failed to create share link." }
    }

    return { success: true, key }
  } catch (error) {
    console.error("Error generating share link:", error)
    return { success: false, error: "An unexpected error occurred." }
  }
}
