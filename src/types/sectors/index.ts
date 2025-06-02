type SectorsResponse = {
  value: Sector[]
}

type Sector = {
  id: string
  name: string
  slug: string
}

type SectorPercentageResponse = {
  id: string
  sectorName: string
  companyCount: number
  percentage: number
}

export type { Sector, SectorsResponse, SectorPercentageResponse }
