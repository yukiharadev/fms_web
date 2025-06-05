import api from '@/configs/api_client'
import type { CreatePositionRequest } from '@/types/position/request'
import type { PositionResponse } from '@/types/position/response'
import Constants from '@/utils/constant'
import type { AxiosError } from 'axios'
import { defineStore } from 'pinia'

interface PositionState {
  loading: boolean
  error: AxiosError | null
  createPositionSuccess: boolean
  positionList: PositionResponse[] | null
  deletePosition: boolean
}

const PositionStore = defineStore('position', {
  state: (): PositionState => ({
    loading: false,
    error: null,
    createPositionSuccess: false,
    positionList: null,
    deletePosition: false,
  }),

  actions: {
    async createPositionAction(request: CreatePositionRequest) {
      this.loading = true
      this.error = null
      this.createPositionSuccess = false

      try {
        const response = await api.post(Constants.API_POSITION_CREATE, request)
        if (response.status === 200) {
          this.createPositionSuccess = true
          await this.getPositionAction(request.companyId) // Tự động reload sau khi tạo
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
          this.positionList = response.data['value'] as PositionResponse[]
        }
      } catch (error) {
        this.error = error as AxiosError
        throw error
      } finally {
        this.loading = false
      }
    },

    async deletePositionAction(positionId: string) {
      this.loading = true
      this.error = null
      this.deletePosition = false

      const request = {
        ids: [positionId],
      }

      try {
        const response = await api.delete(Constants.API_POSITION_CREATE, {
          data: request,
        })
        if (response.status === 200) {
          this.deletePosition = true
        }
      } catch (error) {
        this.error = error as AxiosError
        throw error
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    isCreateSuccess: (state) => state.createPositionSuccess,
    getPositionList: (state) => state.positionList,
    isDeletePosition: (state) => state.deletePosition,
  },
})

export default PositionStore
