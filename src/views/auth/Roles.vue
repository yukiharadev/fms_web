<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { EditIcon, XIcon } from 'vue-tabler-icons'
import useAuthStore from '@/stores/auth'
import type { GetAllRolesResponse } from '@/types/auth'

const roles = ref<GetAllRolesResponse[]>([])
const dialog = ref(false)
const name = ref<string>('')
const description = ref<string>('')
const dialogEdit = ref(false)

const snackbar = ref({
  show: false,
  message: '',
  color: '',
})

const authStore = useAuthStore()
const fetchAllRoles = async () => {
  await authStore.getAllRoles()
  roles.value = authStore.getRoles ?? []
}

const deleteRole = async (name: string) => {
  await authStore.deleteRoleByName(name)
  if (authStore.isDeleteRole) {
    fetchAllRoles()
  }
  snackbar.value.show = true
  snackbar.value.message = 'Xóa Role thành công'
  snackbar.value.color = 'success'
}

const openDialog = () => {
  dialog.value = true
}

const addRole = async () => {
  await authStore.createRole(name.value, description.value)
  if (authStore.isAddRole) {
    fetchAllRoles()
    dialog.value = false
    name.value = ''
    description.value = ''
  }
  snackbar.value.show = true
  snackbar.value.message = 'Thêm Role thành công'
  snackbar.value.color = 'success'
}

const editRole = async () => {
  await authStore.userUpdateRole(name.value, description.value)
  if (authStore.isUpdateRole) {
    fetchAllRoles()
  }
  dialogEdit.value = false
  name.value = ''
  description.value = ''

  snackbar.value.show = true
  snackbar.value.message = 'Sửa Role thành công'
  snackbar.value.color = 'success'
}
onMounted(() => {
  fetchAllRoles()
})
</script>

<template>
  <v-card elevation="10" class="mx-auto my-6">
    <v-card-item>
      <v-card-title class="text-h5 pt-sm-2 pb-7">
        <div class="flex justify-between items-center">
          <h5>Roles</h5>
          <v-btn color="primary" variant="tonal" size="small" @click="openDialog">
            Thêm Role
          </v-btn>
        </div>
      </v-card-title>

      <v-table>
        <thead>
          <tr>
            <th class="text-subtitle-1 font-weight-bold">STT</th>
            <th class="text-subtitle-1 font-weight-bold">Tên Role</th>
            <th class="text-subtitle-1 font-weight-bold">Mô tả</th>
            <th class="text-subtitle-1 font-weight-bold text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in roles" :key="item.id" class="month-item">
            <td>
              <p class="text-15 font-weight-medium">{{ index + 1 }}</p>
            </td>
            <td>
              <v-chip
                :class="
                  'text-body-1 bg-' + (item.name.toLowerCase() === 'admin' ? 'primary' : 'success')
                "
                color="white"
                size="small"
                variant="flat"
              >
                {{ item.name.toUpperCase() }}
              </v-chip>
            </td>
            <td>
              <h6 class="text-body-1 text-muted">{{ item.description }}</h6>
            </td>

            <td>
              <div class="d-flex justify-center">
                <v-btn
                  class="text-h6 mr-2 text-right"
                  color="primary"
                  variant="tonal"
                  size="small"
                  @click="
                    () => {
                      dialogEdit = true
                      name = item.name
                      description = item.description
                    }
                  "
                >
                  <EditIcon size="20" stroke-width="1.5" />
                </v-btn>
                <v-btn
                  class="text-h6 text-right"
                  color="error"
                  variant="tonal"
                  size="small"
                  @click="deleteRole(item.name)"
                >
                  <XIcon size="20" stroke-width="1.5" />
                </v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-card-actions class="justify-center mt-4"> </v-card-actions>
      <v-dialog v-model="dialog" width="500">
        <v-card class="pa-2">
          <v-card-title class="text-h5 ml-2"> Thêm Role </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field label="Tên Role" v-model="name" />
              <v-text-field label="Mô tả" v-model="description" />
              <div class="d-flex justify-end gap-3">
                <v-btn color="primary" variant="tonal" size="small" @click="addRole"> Thêm </v-btn>
                <v-btn color="error" variant="tonal" size="small" @click="dialog = false">
                  Hủy
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogEdit" width="500">
        <v-card class="pa-2">
          <v-card-title class="text-h5 ml-2"> Sửa Role </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field label="Tên Role" v-model="name" />
              <v-text-field label="Mô tả" v-model="description" />
            </v-form>
          </v-card-text>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="primary" variant="tonal" size="small" @click="editRole"> Sửa </v-btn>
            <v-btn color="error" variant="tonal" size="small" @click="dialogEdit = false">
              Hủy
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-item>
  </v-card>
  <v-snackbar v-model="snackbar.show" location="top right" :color="snackbar.color" timeout="6000">
    {{ snackbar.message }}
  </v-snackbar>
</template>
