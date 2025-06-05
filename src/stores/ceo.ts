import api from '@/configs/api_client'
import type { PersonPageRespone, PersonRespone } from '@/types/company'
import Constants from '@/utils/constant'
import type { AxiosError } from 'axios'
import { defineStore } from 'pinia'

interface CeoState {
  ceo: PersonPageRespone[] | null
  searchCeo: PersonRespone[] | null
  addCeo: boolean
  totalRecord: number
  loading: boolean
  error: AxiosError | null
}

const CeoStore = defineStore('ceo', {
  state: (): CeoState => ({
    ceo: null,
    totalRecord: 0,
    searchCeo: null,
    addCeo: false,
    loading: false,
    error: null,
  }),

  getters: {
    isLoading: (state) => state.loading,
    getCeo: (state) => state.ceo,
    getError: (state) => state.error,
    getSearchCeo: (state) => state.searchCeo,
    getAddCeo: (state) => state.addCeo,
  },

  actions: {
    async getPaginationCeo(page: number, size: number) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(Constants.API_CEO_GET_PAGINATION, {
          params: {
            PageIndex: page,
            PageSize: size,
          },
        })

        this.ceo = response.data['value']['dataResponse']
        this.totalRecord = response.data['value']['totalRecord']
      } catch (error) {
        this.error = error as AxiosError
        console.error('Error fetching CEO:', error)
      } finally {
        this.loading = false
      }
    },
    async getSeachCeoAction(keyword: string) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(Constants.API_CEO_SEARCH + keyword)
        this.searchCeo = response.data['value']
      } catch (error) {
        this.error = error as AxiosError
        console.error('Error fetching CEO:', error)
      } finally {
        this.loading = false
      }
    },
    async addCeoAction(ceo: any) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post(Constants.API_CEO_ADD, ceo)
        if (response.status === 200) {
          this.addCeo = true
        }
      } catch (error) {
        this.error = error as AxiosError
        console.error('Error adding CEO:', error)
      } finally {
        this.loading = false
      }
    },
  },
})

export default CeoStore
