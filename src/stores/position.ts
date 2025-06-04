import api from '@/configs/api_client'
import type { CreatePositionRequest } from '@/types/position/request'
import type { PositionResponse } from '@/types/position/response'
import Constants from '@/utils/constant'
import type { AxiosError } from 'axios'
import { defineStore } from 'pinia'

interface PositionState {
  loading: boolean
  error: AxiosError | null
  createPosition: boolean
  getPosition: PositionResponse[]
}

const PositionStore = defineStore('position', {
  state: (): PositionState => ({
    loading: false,
    error: null,
    createPosition: false,
    getPosition: [],
  }),
  actions: {
    async createPositionAction(request: CreatePositionRequest) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post(Constants.API_POSITION_CREATE, request)
        if (response.status === 200) {
          this.createPosition = true
        }
      } catch (error) {
        this.error = error as AxiosError
        console.error('Create position error:', error)
      } finally {
        this.loading = false
      }
    },
    async getPositionAction(companyId: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(Constants.API_GET_COMPANY_POSITION + companyId)
        if (response.status === 200) {
          this.getPosition = response.data['value']
        }
      } catch (error) {
        this.error = error as AxiosError
        console.error('Get position error:', error)
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    createPositionSuccess: (state) => state.createPosition,
    getPosition: (state) => state.getPosition,
  },
})

export default PositionStore
