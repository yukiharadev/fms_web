<script setup lang="ts">
import useSectorStore from '@/stores/sector'
import { EyeIcon } from 'vue-tabler-icons'
import { ref, onMounted, computed } from 'vue'
import type { SectorPercentageResponse } from '@/types/sectors'
import { useRouter } from 'vue-router'

const sectorStore = useSectorStore()
const page = ref(1)
const pageSize = 10

const sectors = ref<SectorPercentageResponse[]>([])

const router = useRouter()

const navigateToCompanyList = (sectorId: string) => {
  router.push({
    name: 'company-list-sector',
    params: { id: sectorId },
  })
}

const fetchSectorPercentage = async () => {
  await sectorStore.getSectorPercentage()
  sectors.value = sectorStore.getPercentage ?? []
}

onMounted(fetchSectorPercentage)

const totalPages = computed(() => Math.ceil(sectors.value.length / pageSize))

const paginatedSectors = computed(() => {
  const start = (page.value - 1) * pageSize
  return sectors.value.slice(start, start + pageSize)
})
</script>

<template>
  <v-card elevation="10">
    <v-card-item class="pa-6">
      <v-card-title class="text-h5 pt-sm-2 pb-7">
        Danh sách tỉ lệ công ty theo ngành nhiều nhất
      </v-card-title>

      <v-table class="month-table">
        <thead>
          <tr>
            <th class="text-subtitle-1 font-weight-bold">STT</th>
            <th class="text-subtitle-1 font-weight-bold">Ngành nghề</th>
            <th class="text-subtitle-1 font-weight-bold">Tỉ lệ</th>
            <th class="text-subtitle-1 font-weight-bold">Số lượng công ty</th>
            <th class="text-subtitle-1 font-weight-bold">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedSectors" :key="item.id" class="month-item">
            <td>
              <p class="text-15 font-weight-medium">
                {{ (page - 1) * pageSize + index + 1 }}
              </p>
            </td>
            <td>
              <p class="text-15 font-weight-medium">{{ item.sectorName }}</p>
            </td>
            <td>
              <h6 class="text-subtitle-1 font-weight-bold">{{ item.percentage }}%</h6>
            </td>
            <td>
              <h6 class="text-body-1 text-muted">{{ item.companyCount }}</h6>
            </td>
            <td class="text-subtitle-1 font-weight-bold">
              <v-btn
                class="mx-1 my-1"
                color="primary"
                @click="navigateToCompanyList(item.id)"
                variant="tonal"
                size="small"
              >
                <EyeIcon size="20" stroke-width="1.5" />
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-card-actions class="justify-center mt-4">
        <v-pagination v-model="page" :length="totalPages" :total-visible="5" color="primary" />
      </v-card-actions>
    </v-card-item>
  </v-card>
</template>
