import { defineStore } from 'pinia'
import type { AxiosError } from 'axios'
import Constants from '@/utils/constant'
import api from '@/configs/api_client'
import type { FinancialData } from '@/types/financial'

interface FinanceState {
  financeBulk: boolean
  loading: boolean
  error: AxiosError | null
  financialData: FinancialData
}

const FinanceStore = defineStore('finance', {
  state: (): FinanceState => ({
    financeBulk: false,
    financialData: {
      headers: [],
      data: [],
    },
    loading: false,
    error: null,
  }),

  getters: {
    isLoading: (state) => state.loading,
    getFinanceBulk: (state) => state.financeBulk,
    getError: (state) => state.error,
  },

  actions: {
    async uploadFinanceBulk(file: File) {
      this.loading = true
      this.error = null
      try {
        const formData = new FormData()
        formData.append('file', file)
        const headers = {
          'Content-Type': 'multipart/form-data',
        }
        const response = await api.post(Constants.API_FINANCIAL_IMPORT, formData, {
          headers,
        })
        this.financeBulk = true
      } catch (error) {
        this.error = error as AxiosError
      } finally {
        this.loading = false
      }
    },
    async getFinancialData(category: string, search: string, quarter: number, year: number) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(Constants.API_FINANCIAL_GET + category, {
          params: {
            symbol: search,
            quarter,
            year,
          },
        })
        this.financialData = response.data['value']
      } catch (error) {
        this.error = error as AxiosError
      } finally {
        this.loading = false
      }
    },
  },
})

export default FinanceStore
