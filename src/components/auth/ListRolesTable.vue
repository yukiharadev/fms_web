<script setup lang="ts">
import { ref, computed } from 'vue'
import { usersCards } from '@/data/dashboard/chartData'
import { EditIcon, XIcon } from 'vue-tabler-icons'

const itemsPerPage = 5
const currentPage = ref(1)

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return usersCards.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(usersCards.length / itemsPerPage))
</script>

<template>
  <v-card elevation="10" class="mx-auto my-6">
    <v-card-item>
      <v-card-title class="text-h5 pt-sm-2 pb-7">Users</v-card-title>

      <v-table>
        <thead>
          <tr>
            <th class="text-subtitle-1 font-weight-bold">STT</th>
            <th class="text-subtitle-1 font-weight-bold">Name</th>
            <th class="text-subtitle-1 font-weight-bold">Email</th>
            <th class="text-subtitle-1 font-weight-bold">UserName</th>
            <th class="text-subtitle-1 font-weight-bold">Roles</th>
            <th class="text-subtitle-1 font-weight-bold text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedItems" :key="item.id" class="month-item">
            <td>
              <p class="text-15 font-weight-medium">{{ index + 1 }}</p>
            </td>
            <td>
              <div>
                <h6 class="text-subtitle-1 font-weight-bold">{{ item.name }}</h6>
                <div class="text-13 mt-1 text-muted">{{ item.name }}</div>
              </div>
            </td>
            <td>
              <h6 class="text-body-1 text-muted">{{ item.email }}</h6>
            </td>
            <td>
              <h6 class="text-body-1 text-muted">{{ item.userName }}</h6>
            </td>
            <td>
              <template v-for="role in item.roles" :key="role">
                <v-chip
                  :class="
                    'text-body-1 bg-' + (role.toLowerCase() === 'admin' ? 'primary' : 'success')
                  "
                  color="white"
                  size="small"
                  variant="flat"
                >
                  {{ role }}
                </v-chip>

                <span v-if="role !== item.roles[item.roles.length - 1]">,</span>
              </template>
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
                      console.log('edit', item)
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
                  @click="
                    () => {
                      console.log('delete', item)
                    }
                  "
                >
                  <XIcon size="20" stroke-width="1.5" />
                </v-btn>
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
