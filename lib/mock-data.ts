import type { Unit, Case } from "./types"

// Generate realistic mock data for demonstration
export const mockUnits: Unit[] = [
  {
    id: "1",
    name: "Centro de Saúde Norte",
    latitude: -23.5505,
    longitude: -46.6333,
    category: "Saúde",
    region: "Norte",
    address: "Rua das Flores, 123",
  },
  {
    id: "2",
    name: "Escola Municipal Sul",
    latitude: -23.5605,
    longitude: -46.6433,
    category: "Educação",
    region: "Sul",
    address: "Av. Principal, 456",
  },
  {
    id: "3",
    name: "Hospital Regional Leste",
    latitude: -23.5405,
    longitude: -46.6233,
    category: "Saúde",
    region: "Leste",
    address: "Praça Central, 789",
  },
  {
    id: "4",
    name: "Centro Comunitário Oeste",
    latitude: -23.5705,
    longitude: -46.6533,
    category: "Social",
    region: "Oeste",
    address: "Rua Nova, 321",
  },
  {
    id: "5",
    name: "Posto de Atendimento Centro",
    latitude: -23.5555,
    longitude: -46.6383,
    category: "Saúde",
    region: "Centro",
    address: "Av. Brasil, 654",
  },
  {
    id: "6",
    name: "Creche Municipal Norte",
    latitude: -23.5455,
    longitude: -46.6283,
    category: "Educação",
    region: "Norte",
    address: "Rua Esperança, 987",
  },
  {
    id: "7",
    name: "Centro de Assistência Sul",
    latitude: -23.5655,
    longitude: -46.6483,
    category: "Social",
    region: "Sul",
    address: "Av. Liberdade, 147",
  },
  {
    id: "8",
    name: "Unidade de Emergência Leste",
    latitude: -23.5355,
    longitude: -46.6183,
    category: "Saúde",
    region: "Leste",
    address: "Rua Urgente, 258",
  },
  {
    id: "9",
    name: "Escola Técnica Oeste",
    latitude: -23.5755,
    longitude: -46.6583,
    category: "Educação",
    region: "Oeste",
    address: "Av. Tecnologia, 369",
  },
  {
    id: "10",
    name: "Centro de Apoio Centro",
    latitude: -23.5525,
    longitude: -46.6353,
    category: "Social",
    region: "Centro",
    address: "Praça União, 741",
  },
  {
    id: "11",
    name: "Clínica Especializada Norte",
    latitude: -23.5475,
    longitude: -46.6303,
    category: "Saúde",
    region: "Norte",
    address: "Rua Saúde, 852",
  },
  {
    id: "12",
    name: "Escola Rural Sul",
    latitude: -23.5685,
    longitude: -46.6463,
    category: "Educação",
    region: "Sul",
    address: "Estrada Rural, 963",
  },
]

const types = ["Consulta", "Atendimento", "Ocorrência", "Registro", "Visita"]
const responsibles = ["Maria Silva", "João Santos", "Ana Costa", "Pedro Lima", "Carla Souza"]
const ageGroups = ["0-12", "13-17", "18-25", "26-40", "41-60", "60+"]
const demographics = ["Urbano", "Rural", "Periférico"]
const profiles = ["Individual", "Familiar", "Comunitário"]

function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString().split("T")[0]
}

export const mockCases: Case[] = Array.from({ length: 150 }, (_, i) => ({
  id: `case-${i + 1}`,
  unitId: mockUnits[Math.floor(Math.random() * mockUnits.length)].id,
  type: types[Math.floor(Math.random() * types.length)],
  date: randomDate(new Date("2024-01-01"), new Date("2024-12-31")),
  responsible: responsibles[Math.floor(Math.random() * responsibles.length)],
  ageGroup: ageGroups[Math.floor(Math.random() * ageGroups.length)],
  demographic: demographics[Math.floor(Math.random() * demographics.length)],
  profile: profiles[Math.floor(Math.random() * profiles.length)],
  description: `Caso ${i + 1} - Registro de ${types[Math.floor(Math.random() * types.length)].toLowerCase()}`,
}))

export const filterOptions = {
  types,
  regions: ["Norte", "Sul", "Leste", "Oeste", "Centro"],
  responsibles,
  ageGroups,
  demographics,
  profiles,
}
