import api from '@/configs/api_client'
import type {
  CompanyDetail,
  CompanyPageResponse,
  CompanyLeadershipResponse,
  PersonRespone,
  CompanyResponse,
  TopAssetsResponse,
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from '@/types/company'
import Constants from '@/utils/constant'
import type { AxiosError } from 'axios'
import { defineStore } from 'pinia'

interface CompanyState {
  PageCompany: CompanyPageResponse[] | null
  CompanyDetail: CompanyDetail | null
  Leadership: CompanyLeadershipResponse[] | null
  PersonDetail: PersonRespone | null
  SearchCompany: CompanyResponse[] | null
  TopAssets: TopAssetsResponse[] | null
  CompanyBySector: CompanyResponse[] | null
  CreateCompany: boolean
  UpdateCompany: boolean
  loading: boolean
  error: AxiosError | null
}

const CompanyStore = defineStore('company', {
  state: (): CompanyState => ({
    PageCompany: null,
    CreateCompany: false,
    UpdateCompany: false,
    CompanyDetail: null,
    PersonDetail: null,
    SearchCompany: null,
    Leadership: null,
    TopAssets: null,
    CompanyBySector: null,
    loading: false,
    error: null,
  }),

  getters: {
    isLoading: (state) => state.loading,
    getPageCompany: (state) => state.PageCompany,
    getCompanyDetail: (state) => state.CompanyDetail,
    getLeadership: (state) => state.Leadership,
    getPersonDetails: (state) => state.PersonDetail,
    getSearchCompanies: (state) => state.SearchCompany,
    getTopAssets: (state) => state.TopAssets,
    isCreateCompany: (state) => state.CreateCompany,
  },

  actions: {
    async getPageCompanies(pageIndex: number, pageSize: number) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(
          `${Constants.API_COMPANY_PAGE}?PageIndex=${pageIndex}&PageSize=${pageSize}`,
        )

        if (response.status == 200) {
          this.PageCompany = response.data['value']['dataResponse']
        }
      } catch (error) {
        this.error = error as AxiosError
        console.error('Error fetching companies:', error)
      } finally {
        this.loading = false
      }
    },
    async getCompanyDetailBySymbol(symbol: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(`${Constants.API_COMPANY_GET_BY_SYMBOL}${symbol}`)

        this.CompanyDetail = response.data['value']
      } catch (error) {
        this.error = error as AxiosError
        console.error('Error fetching company details:', error)
      } finally {
        this.loading = false
      }
    },

    async getCompanyLeadership(companyId: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(`${Constants.API_COMPANY_GET_LEADERSHIP}${companyId}`)

        this.Leadership = response.data['value']
      } catch (error) {
        this.error = error as AxiosError
        console.error('Error fetching company leadership:', error)
      } finally {
        this.loading = false
      }
    },

    async getPersonDetail(personId: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(`${Constants.API_COMPANY_GET_PERSON_DETAIL}${personId}`)

        this.PersonDetail = response.data['value']
        console.log(this.PersonDetail)
      } catch (error) {
        this.error = error as AxiosError
        console.error('Error fetching person detail:', error)
      } finally {
        this.loading = false
      }
    },

    async getSearchCompany(keyword: string) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(`${Constants.API_COMPANY_SEARCH}${keyword}`)

        this.SearchCompany = response.data['value']
      } catch (error) {
        this.error = error as AxiosError
      } finally {
        this.loading = false
      }
    },

    async getTopAsset() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(`${Constants.API_FINANCIAL_GET_TOPASSETS}`)
        this.TopAssets = response.data['value']
        console.log(this.TopAssets)
      } catch (error) {
        this.error = error as AxiosError
        console.error('Error fetching top assets:', error)
      } finally {
        this.loading = false
      }
    },

    async getCompanyBySector(sectorId: string) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(`${Constants.API_COMPANY_GET_ALL_BY_SECTOR}${sectorId}`)
        this.CompanyBySector = response.data['value']
      } catch (error) {
        this.error = error as AxiosError
        console.error('Error fetching company by sector:', error)
      } finally {
        this.loading = false
      }
    },

    async createCompany(request: CreateCompanyRequest) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post(Constants.API_COMPANY_CREATE, request)
        this.CreateCompany = true
      } catch (error) {
        this.error = error as AxiosError
        console.error('Error creating company:', error)
      }
    },
    async updateCompany(request: UpdateCompanyRequest) {
      this.loading = true
      this.error = null

      try {
        const response = await api.put(Constants.API_COMPANY_UPDATE, request)
        if (response.status == 200) {
          this.UpdateCompany = true
        }
      } catch (error) {
        this.error = error as AxiosError
        console.error('Error updating company:', error)
      }
    },
  },
})

export default CompanyStore
