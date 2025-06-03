import api from '@/configs/api_client'
import type { SectorPercentageResponse, SectorsResponse } from '@/types/sectors'
import Constants from '@/utils/constant'
import { defineStore } from 'pinia'

interface SectorState {
  sector: SectorsResponse | null
  sectorPercentage: SectorPercentageResponse[] | null
  createSector: boolean
  deleteSector: boolean
  updateSector: boolean
  loading: boolean
  error: string | null
}

const useSectorStore = defineStore('sector', {
  state: (): SectorState => ({
    createSector: false,
    deleteSector: false,
    sector: null,
    sectorPercentage: null,
    updateSector: false,
    loading: false,
    error: null,
  }),

  getters: {
    isLoading: (state) => state.loading,
    getSector: (state) => state.sector,
    getPercentage: (state) => state.sectorPercentage,
    createSectorSuccess: (state) => state.createSector,
    deleteSectorSuccess: (state) => state.deleteSector,
    updateSectorSuccess: (state) => state.updateSector,
  },

  actions: {
    async getAllSectors() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get<SectorsResponse>(Constants.API_GET_ALL_SECTORS)
        console.log(response.data)
        this.sector = response.data
      } catch (error) {
        this.error = 'Failed to fetch sectors'
        console.error('Fetch sectors error:', error)
      }
    },
    async getSectorPercentage() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(Constants.API_GET_SECTOR_PERCENTAGE)

        this.sectorPercentage = response.data['value']
        console.log(this.sectorPercentage)
      } catch (error) {
        this.error = 'Failed to fetch sector percentage'
        console.error('Fetch sector percentage error:', error)
      }
    },

    async createBusinessSector(data: { name: string }) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post(Constants.API_CREATE_BUSINESS_SECTOR, data)
        if (response.status === 200) {
          this.createSector = true
        } else {
          throw new Error('Failed to create business sector')
        }
      } catch (error) {
        this.error = 'Failed to create business sector'
        console.error('Create business sector error:', error)
      }
    },

    async deleteBusinessSector(id: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.delete(Constants.API_CREATE_BUSINESS_SECTOR, {
          data: {
            ids: [id],
          },
        })
        if (response.status === 200) {
          this.deleteSector = true
        } else {
          throw new Error('Failed to delete business sector')
        }
      } catch (error) {}
    },

    async updateBusinessSector(data: { id: string; name: string }) {
      this.loading = true
      this.error = null

      try {
        const response = await api.patch(Constants.API_CREATE_BUSINESS_SECTOR, data)
        if (response.status === 200) {
          this.updateSector = true
        } else {
          throw new Error('Failed to update business sector')
        }
      } catch (error) {
        this.error = 'Failed to update business sector'
      }
    },
  },
})

export default useSectorStore
