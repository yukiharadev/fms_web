import type { Sector } from '../sectors'

type CompanyDetail = {
  company: CompanyResponse
  sector: Sector
}

type CompanyResponse = {
  id: string
  companyName: string
  symbol: string
  logoUrl: string | null
  listedShares: number | null
  description: string | null
  address: string | null
  taxCode: string | null
  phoneNumber: string | null
  website: string | null
  email: string | null
  slug: string
}

type TopAssetsResponse = {
  symbol: string
  value: number
}

type CompanyPageResponse = {
  id: {
    value: string
  }
  companyName: string
  symbol: string
  logoUrl: string | null
  listedShares: number | null
  description: string | null
  address: string | null
  taxCode: string | null
  phoneNumber: string | null
  website: string | null
  email: string | null
  slug: string
}

type CompanyLeadershipResponse = {
  department: string
  positions: PositionResponse[]
}

type EmployeesResponse = {
  id: string
  personId: string
  name: string
}

type PositionResponse = {
  id: string
  name: string
  employees: EmployeesResponse[]
}

type FlattenedLeadership = {
  department: string
  position_id: string
  position_name: string
  employee_id: string
  personId: string
  employee_name: string
}

type PersonRespone = {
  id: string | object
  fullName: string
  birthDay: string | null
  avatarUrl: string | null
  address: string | null
  residence: string | null
  description: string | null
}

type PersonPageRespone = {
  id: {
    value: string
  }
  fullName: string
  birthDate: string | null
  avatarUrl: string | null
  address: string | null
  residence: string | null
  description: string | null
}

type CreateCompanyRequest = {
  companyName: string
  symbol: string
  logoUrl: string
  listedShares: number
  description: string
  address: string
  taxCode: string
  phoneNumber: string
  email: string
  website: string
  sectorId: string
}

type UpdateCompanyRequest = {
  id: string
  companyName: string
  symbol: string
  logoUrl: string
  listedShares: number
  description: string
  address: string
  taxCode: string
  phoneNumber: string
  email: string
  website: string
  sectorId: string
}

export type {
  CompanyDetail,
  CompanyResponse,
  CompanyPageResponse,
  CompanyLeadershipResponse,
  EmployeesResponse,
  PositionResponse,
  FlattenedLeadership,
  CreateCompanyRequest,
  PersonRespone,
  PersonPageRespone,
  TopAssetsResponse,
  UpdateCompanyRequest,
}
