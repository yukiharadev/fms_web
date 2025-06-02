type FinancialData = {
  headers: {
    quarter: number
    year: number
  }[]
  data: {
    categoryName: string
    value: number[]
  }[]
}

export type { FinancialData }
