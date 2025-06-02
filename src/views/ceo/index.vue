<template>
  <v-card class="absolute top-10">
    <v-card-title class="text-xl sm:text-2xl font-bold"> Danh sách CEO </v-card-title>
    <v-table>
      <thead>
        <tr>
          <th class="text-subtitle-1 font-weight-bold">STT</th>
          <th class="text-subtitle-1 font-weight-bold">Họ tên</th>
          <th class="text-subtitle-1 font-weight-bold">Địa chỉ</th>
          <th class="text-subtitle-1 font-weight-bold">Nơi ở</th>
          <th class="text-subtitle-1 font-weight-bold text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in leadershipData" :key="item.id.value">
          <td class="text-subtitle-1">{{ index + 1 }}</td>
          <td class="text-subtitle-1">{{ item.fullName ?? 'Không có thông tin' }}</td>
          <td class="text-subtitle-1">{{ item.address ?? 'Không có thông tin' }}</td>
          <td class="text-subtitle-1">{{ item.residence ?? 'Không có thông tin' }}</td>
          <td class="text-center">
            <v-btn
              class="text-h6 mr-4 ml-2 text-right"
              color="primary"
              @click="viewCeo(item.id.value)"
              variant="tonal"
              size="small"
            >
              <EyeIcon size="20" stroke-width="1.5" />
            </v-btn>
            <v-btn
              class="text-h6 mr-4 ml-2 text-right"
              color="primary"
              variant="tonal"
              size="small"
            >
              <EditIcon size="20" stroke-width="1.5" />
            </v-btn>
            <v-btn class="text-h6 mr-4 ml-2 text-right" color="error" variant="tonal" size="small">
              <TrashIcon size="20" stroke-width="1.5" />
            </v-btn>
          </td>
        </tr>
        <tr v-if="leadershipData.length === 0">
          <td colspan="4" class="text-center italic">Chưa có dữ liệu lãnh đạo</td>
        </tr>
      </tbody>
    </v-table>
    <v-card-actions class="justify-center mt-4">
      <v-pagination v-model="currentPage" :length="totalPages" :total-visible="5" color="primary" />
    </v-card-actions>
    <v-divider></v-divider>
  </v-card>
</template>

<script setup lang="ts">
import type { PersonPageRespone } from '@/types/company'
import { ref, onMounted, computed, watch } from 'vue'
import { EyeIcon, EditIcon, TrashIcon } from 'vue-tabler-icons'
import CeoStore from '@/stores/ceo'
import { useRouter } from 'vue-router'

const ceoStore = CeoStore()
const router = useRouter()

const leadershipData = ref<PersonPageRespone[]>([])

const currentPage = ref(1)
const size = ref(20)

const totalPages = computed(() => {
  const totalRecord = ceoStore.totalRecord
  return Math.ceil(totalRecord / size.value)
})

const fetchAllCeo = async () => {
  await ceoStore.getPaginationCeo(currentPage.value - 1, size.value)
  leadershipData.value = ceoStore.getCeo ?? []
  console.log(leadershipData.value)
}

const viewCeo = (id: string) => {
  router.push({
    name: 'person-detail',
    params: { id },
  })
}

onMounted(fetchAllCeo)

watch(currentPage, fetchAllCeo)
</script>

<style scoped></style>
