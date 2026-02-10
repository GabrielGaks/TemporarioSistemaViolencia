"use client"

import { useMemo, useCallback } from "react"
import type { Unit, Case, FilterState, UnitWithCases, Statistics } from "./types"

function getIntensity(cases: number, maxCases: number): UnitWithCases["intensity"] {
  if (cases === 0) return "none"
  const ratio = cases / maxCases
  if (ratio < 0.25) return "low"
  if (ratio < 0.5) return "medium"
  if (ratio < 0.75) return "high"
  return "critical"
}

export function useHeatmapData(units: Unit[], cases: Case[], filters: FilterState) {
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // Type filter
      if (filters.type.length > 0 && !filters.type.includes(c.type)) return false

      // Region filter (need to check unit's region)
      if (filters.region.length > 0) {
        const unit = units.find((u) => u.id === c.unitId)
        if (!unit || !filters.region.includes(unit.region)) return false
      }

      // Responsible filter
      if (filters.responsible.length > 0 && !filters.responsible.includes(c.responsible)) return false

      // Date range filter
      if (filters.dateRange) {
        const caseDate = new Date(c.date)
        const startDate = new Date(filters.dateRange.start)
        const endDate = new Date(filters.dateRange.end)
        if (caseDate < startDate || caseDate > endDate) return false
      }

      // Age group filter
      if (filters.ageGroup.length > 0 && !filters.ageGroup.includes(c.ageGroup)) return false

      // Demographic filter
      if (filters.demographic.length > 0 && !filters.demographic.includes(c.demographic)) return false

      // Profile filter
      if (filters.profile.length > 0 && !filters.profile.includes(c.profile)) return false

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const unit = units.find((u) => u.id === c.unitId)
        const matchesUnit = unit?.name.toLowerCase().includes(searchLower)
        const matchesDescription = c.description.toLowerCase().includes(searchLower)
        if (!matchesUnit && !matchesDescription) return false
      }

      return true
    })
  }, [cases, filters, units])

  const unitsWithCases = useMemo(() => {
    // Count cases per unit
    const caseCounts = new Map<string, { total: number; byType: Record<string, number> }>()

    filteredCases.forEach((c) => {
      const existing = caseCounts.get(c.unitId) || { total: 0, byType: {} }
      existing.total += 1
      existing.byType[c.type] = (existing.byType[c.type] || 0) + 1
      caseCounts.set(c.unitId, existing)
    })

    // Find max cases for intensity calculation
    const maxCases = Math.max(1, ...Array.from(caseCounts.values()).map((v) => v.total))

    // Region filter for units
    let filteredUnits = units
    if (filters.region.length > 0) {
      filteredUnits = units.filter((u) => filters.region.includes(u.region))
    }

    return filteredUnits.map((unit) => {
      const caseData = caseCounts.get(unit.id) || { total: 0, byType: {} }
      return {
        ...unit,
        totalCases: caseData.total,
        casesByType: caseData.byType,
        intensity: getIntensity(caseData.total, maxCases),
      } as UnitWithCases
    })
  }, [units, filteredCases, filters.region])

  const statistics = useMemo<Statistics>(() => {
    const unitsWithData = unitsWithCases.filter((u) => u.totalCases > 0)
    const totalCases = unitsWithData.reduce((sum, u) => sum + u.totalCases, 0)

    let maxUnit: Statistics["maxUnit"] = null
    let minUnit: Statistics["minUnit"] = null

    if (unitsWithData.length > 0) {
      const sorted = [...unitsWithData].sort((a, b) => b.totalCases - a.totalCases)
      maxUnit = { name: sorted[0].name, cases: sorted[0].totalCases }
      minUnit = { name: sorted[sorted.length - 1].name, cases: sorted[sorted.length - 1].totalCases }
    }

    return {
      totalUnits: unitsWithCases.length,
      unitsWithCases: unitsWithData.length,
      totalCases,
      maxUnit,
      minUnit,
      averageCases: unitsWithData.length > 0 ? Math.round((totalCases / unitsWithData.length) * 10) / 10 : 0,
    }
  }, [unitsWithCases])

  const getCasesForUnit = useCallback(
    (unitId: string) => {
      return filteredCases.filter((c) => c.unitId === unitId)
    },
    [filteredCases],
  )

  return {
    filteredCases,
    unitsWithCases,
    statistics,
    getCasesForUnit,
  }
}
