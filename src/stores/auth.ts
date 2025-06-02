import { defineStore } from 'pinia'
import type {
  GetAllUsersResponse,
  LoginSuccessResponse,
  TokenResponse,
  UserData,
  GetAllRolesResponse,
} from '@/types/auth/index.ts'
import api from '@/configs/api_client'
import Constants from '@/utils/constant'

interface AuthState {
  allUsers: GetAllUsersResponse[] | null
  allRoles: GetAllRolesResponse[] | null
  deleteRole: boolean
  user: UserData | null
  addRole: boolean
  accessToken: TokenResponse['accessToken'] | null
  refreshToken: TokenResponse['refreshToken'] | null
  loading: boolean
  error: string | null
  assignRole: boolean
  updateRole: boolean
}

const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    allUsers: null,
    allRoles: null,
    deleteRole: false,
    user: null,
    addRole: false,
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null,
    assignRole: false,
    updateRole: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    getUsers: (state) => state.allUsers,
    getRoles: (state) => state.allRoles,
    isAddRole: (state) => state.addRole,
    isLoading: (state) => state.loading,
    isDeleteRole: (state) => state.deleteRole,
    isAssignRole: (state) => state.assignRole,
    isUpdateRole: (state) => state.updateRole,
  },

  actions: {
    async login({ userName, password }: { userName: string; password: string }) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post<LoginSuccessResponse>(Constants.API_AUTH_LOGIN, {
          userName: userName,
          password: password,
        })
        if (response.status === 200) {
          localStorage.setItem('email', userName)
          this.user = response.data.value.userData
          this.accessToken = response.data.value.tokenResponse.accessToken
          this.refreshToken = response.data.value.tokenResponse.refreshToken
          this.user.id = response.data.value.userData.id
          this.user = response.data.value.userData

          localStorage.setItem('access_token', this.accessToken)
          localStorage.setItem('refresh_token', this.refreshToken)
          localStorage.setItem('user_id', this.user.id)
          localStorage.setItem('user', JSON.stringify(this.user))
        } else {
          throw new Error('Login failed')
        }
      } catch (error) {
        this.error = 'Login failed'
        console.error('Login error:', error)
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      this.loading = false
      this.error = null

      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_id')
    },

    loadTokenFromLocalStorage() {
      const accessToken = localStorage.getItem('access_token')
      const refreshToken = localStorage.getItem('refresh_token')
      const userId = localStorage.getItem('user_id')
      const user = localStorage.getItem('user')

      if (accessToken && refreshToken && userId) {
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        this.user = user ? JSON.parse(user) : null
      }
    },

    async getAllUsers() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(Constants.API_GET_ALL_USERS)
        if (response.status === 200) {
          this.allUsers = response.data['value']
        } else {
          throw new Error('Failed to fetch users')
        }
      } catch (error) {
        this.error = 'Failed to fetch users'
        console.error('Error fetching users:', error)
      } finally {
        this.loading = false
      }
    },

    async getAllRoles() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(Constants.API_GET_ROLES)
        if (response.status === 200) {
          this.allRoles = response.data['value']
        } else {
          throw new Error('Failed to fetch roles')
        }
      } catch (error) {
        this.error = 'Failed to fetch roles'
        console.error('Error fetching roles:', error)
      } finally {
        this.loading = false
      }
    },

    async deleteRoleByName(name: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.delete(Constants.API_DELETE_ROLE + name)
        if (response.status === 200) {
          this.deleteRole = true
        } else {
          throw new Error('Failed to delete role')
        }
      } catch (error) {
        this.error = 'Failed to delete role'
        console.error('Error deleting role:', error)
      } finally {
        this.loading = false
      }
    },

    async createRole(name: string, description: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post(Constants.API_CREATE_ROLE, {
          roleName: name,
          description: description,
        })
        if (response.status === 200) {
          this.addRole = true
        } else {
          throw new Error('Failed to create role')
        }
      } catch (error) {
        this.error = 'Failed to create role'
        console.error('Error creating role:', error)
      } finally {
        this.loading = false
      }
    },

    async addRoleUser(userName: string, roleNames: string[]) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post(Constants.API_ASSIGN_ROLE, {
          userName: userName,
          roleNames: roleNames,
        })
        if (response.status === 200) {
          this.assignRole = true
        } else {
          throw new Error('Failed to assign role')
        }
      } catch (error) {
        this.error = 'Failed to assign role'
        console.error('Error assigning role:', error)
      } finally {
        this.loading = false
      }
    },

    async userUpdateRole(name: string, description: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.patch(Constants.API_CREATE_ROLE, {
          roleName: name,
          description: description,
        })
        if (response.status === 200) {
          this.updateRole = true
        } else {
          throw new Error('Failed to update role')
        }
      } catch (error) {
        this.error = 'Failed to update role'
        console.error('Error updating role:', error)
      }
    },
  },
})

export default useAuthStore
