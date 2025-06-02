<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import useAuthStore from '@/stores/auth'
import type { GetAllRolesResponse } from '@/types/auth'

const itemsPerPage = 5
const currentPage = ref(1)

const authStore = useAuthStore()
const roles = ref<GetAllRolesResponse[]>([])

const users = computed(() => authStore.getUsers)

const allRoles = async () => {
  await authStore.getAllRoles()
  roles.value = authStore.getRoles ?? []
}

const getAllUsersRequest = async () => {
  try {
    await authStore.getAllUsers()
    console.log('Users:', users.value)
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

onMounted(() => {
  getAllUsersRequest()
  allRoles()
})

const selectedUserId = ref<string | null>(null)
const selectedRoles = ref<string[]>([])

const assignRole = async (userName: string, roleNames: string[]) => {
  console.log('Assign Role:', userName, roleNames)
  await authStore.addRoleUser(userName, roleNames)
  if (authStore.isAssignRole) {
    getAllUsersRequest()
    selectedUserId.value = null
  }
}

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return users.value?.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil((users.value?.length || 0) / itemsPerPage))
</script>

<template>
  <v-card elevation="10" class="mx-auto my-6">
    <v-card-item>
      <v-card-title class="text-h5 pt-sm-2 pb-7">Danh sách người dùng</v-card-title>

      <v-table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>UserName</th>
            <th>Roles</th>
            <th class="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedItems" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.userDto.fullName }}</td>
            <td>{{ item.userDto.email }}</td>
            <td>{{ item.userDto.userName }}</td>
            <td>
              <template v-for="role in item.roles" :key="role">
                <v-chip
                  :class="role.toLowerCase() === 'admin' ? 'bg-primary' : 'bg-success'"
                  color="white"
                  size="small"
                  variant="flat"
                >
                  {{ role }}
                </v-chip>
                <span v-if="role !== item.roles[item.roles.length - 1]">,</span>
              </template>
            </td>
            <td class="text-center">
              <div v-if="selectedUserId !== item.userDto.userName">
                <v-btn
                  size="small"
                  variant="tonal"
                  color="primary"
                  @click="
                    () => {
                      selectedUserId = item.userDto.userName
                      selectedRoles = []
                    }
                  "
                >
                  Gán Role
                </v-btn>
              </div>

              <div v-else>
                <v-select
                  v-model="selectedRoles"
                  :items="roles.map((r) => r.name)"
                  label="Select Role"
                  density="compact"
                  multiple
                  size="small"
                  hide-details
                  class="mb-2"
                />

                <div>
                  <v-btn
                    size="small"
                    color="success"
                    variant="tonal"
                    @click="
                      () => {
                        assignRole(item.userDto.userName, selectedRoles)
                      }
                    "
                  >
                    Lưu
                  </v-btn>

                  <v-btn
                    size="small"
                    color="error"
                    variant="tonal"
                    class="ml-2"
                    @click="selectedUserId = null"
                  >
                    Hủy
                  </v-btn>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-card-actions class="justify-center mt-4">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          total-visible="5"
          color="primary"
        />
      </v-card-actions>
    </v-card-item>
  </v-card>
</template>
