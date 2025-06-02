import api from '@/configs/api_client'
import type { UploadResponse } from '@/types/upload'
import Constants from '@/utils/constant'
import type { AxiosError } from 'axios'
import { defineStore } from 'pinia'

interface UploadState {
  upload: UploadResponse | null
  uploadFromLocal: UploadResponse | null
  deleteUpload: boolean
  loading: boolean
  error: AxiosError | null
  getURL: UploadResponse | null
}

const useUploadStore = defineStore('upload', {
  state: (): UploadState => ({
    upload: null,
    loading: false,
    error: null,
    uploadFromLocal: null,
    deleteUpload: false,
    getURL: null,
  }),

  actions: {
    async uploadGCSFile(file: File) {
      this.loading = true
      this.error = null

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await api.post(Constants.API_UPLOAD_GCS_FILE, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        this.upload = response.data['value']
      } catch (error) {
        this.error = error as AxiosError
        console.error('Upload file error:', error)
      }
    },

    async uploadFromLocal(file: File) {
      this.loading = true
      this.error = null

      try {
        const formData = new FormData()
        formData.append('file', file)

        const HEADERS = {
          'Content-Type': 'multipart/form-data',
        }

        const response = await api.post(Constants.API_UPLOAD_FROM_LOCAL, formData, {
          headers: HEADERS,
        })

        this.uploadFromLocal = response.data['value']
      } catch (error) {
        this.error = error as AxiosError
        console.error('Upload file error:', error)
      }
    },

    async deleteGCSUpload(key: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.delete(`${Constants.API_UPLOAD_GCS_FILE}/${key}`)

        if (response.status === 200) {
          this.deleteUpload = true
        } else {
          throw new Error('Failed to delete upload')
        }
      } catch (error) {
        this.error = error as AxiosError
        console.error('Delete upload error:', error)
      }
    },

    async URLFromKey(key: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(`${Constants.API_UPLOAD_GCS_FILE}/${key}`)
        if (response.status === 200) {
          this.getURL = response.data['value']
        } else {
          throw new Error('Failed to get URL from key')
        }
      } catch (error) {
        this.error = error as AxiosError
        console.error('Get URL from key error:', error)
      }
    },
  },

  getters: {
    getUpload: (state) => state.upload,
    getUploadFromLocal: (state) => state.uploadFromLocal,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    deleteUploadSuccess: (state) => state.deleteUpload,
    getURLFromKey: (state) => state.upload,
  },
})

export default useUploadStore
