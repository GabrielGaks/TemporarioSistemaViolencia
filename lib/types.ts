// Generic types for the heatmap dashboard

export interface Unit {
  id: string
  name: string
  latitude: number
  longitude: number
  category: string
  region: string
  address: string
}

export interface Case {
  id: string
  unitId: string
  type: string
  date: string
  responsible: string
  ageGroup: string
  demographic: string
  profile: string
  description: string
}

export interface FilterState {
  type: string[]
  region: string[]
  responsible: string[]
  dateRange: { start: string; end: string } | null
  ageGroup: string[]
  demographic: string[]
  profile: string[]
  search: string
}

export interface UnitWithCases extends Unit {
  totalCases: number
  casesByType: Record<string, number>
  intensity: "none" | "low" | "medium" | "high" | "critical"
}

export interface Statistics {
  totalUnits: number
  unitsWithCases: number
  totalCases: number
  maxUnit: { name: string; cases: number } | null
  minUnit: { name: string; cases: number } | null
  averageCases: number
}
