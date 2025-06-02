<template>
  <v-card elevation="10" class="mx-auto my-6">
    <div class="flex justify-between items-center p-4">
      <v-card-title class="text-xl sm:text-2xl font-bold">Danh sách công ty</v-card-title>
    </div>
    <v-divider></v-divider>
    <v-table flat>
      <thead>
        <tr>
          <th class="text-base font-bold w-[150px]">STT</th>
          <th class="text-base font-bold w-[150px]">Mã công ty</th>
          <th class="text-base font-bold">Tên công ty</th>
          <th class="text-base font-bold w-[350px]">Địa chỉ</th>
          <th class="text-base font-bold">Số điện thoại</th>
          <th class="text-base font-bold text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="companyStore.isLoading">
          <td colspan="5" class="text-center text-base py-6">
            <v-progress-circular indeterminate color="primary" size="40" class="mr-2" />
            Đang tải dữ liệu...
          </td>
        </tr>

        <tr v-else-if="!companyStore.CompanyBySector?.length">
          <td colspan="5" class="text-center text-base">Không có công ty nào để hiển thị</td>
        </tr>

        <tr v-else v-for="(item, index) in paginatedCompanies" :key="index">
          <td class="text-base">{{ index + 1 }}</td>

          <td class="text-base">{{ item.symbol }}</td>
          <td class="text-base">{{ item.companyName }}</td>
          <td class="text-base">{{ item.address ?? 'Không có dữ liệu' }}</td>
          <td class="text-base">{{ item.phoneNumber ?? 'Không có dữ liệu' }}</td>
          <td class="text-center">
            <v-btn
              class="mx-1 my-1"
              color="primary"
              variant="tonal"
              size="small"
              @click="viewCompany(item.symbol)"
            >
              <EyeIcon size="20" stroke-width="1.5" />
            </v-btn>
            <v-btn
              class="mx-1 my-1"
              color="primary"
              variant="tonal"
              size="small"
              @click="console.log('edit', item)"
            >
              <EditIcon size="20" stroke-width="1.5" />
            </v-btn>
            <v-btn
              class="mx-1 my-1"
              color="error"
              variant="tonal"
              size="small"
              @click="console.log('delete', item)"
            >
              <XIcon size="20" stroke-width="1.5" />
            </v-btn>
          </td>
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
import { useRoute } from 'vue-router'
import { onMounted, computed, ref } from 'vue'
import CompanyStore from '@/stores/company'
import { EyeIcon, EditIcon, XIcon } from 'vue-tabler-icons'
import { useRouter } from 'vue-router'

const router = useRouter()

const route = useRoute()
const sectorId = route.params.id
const companyStore = CompanyStore()

const currentPage = ref(1)
const pageSize = 10

const totalPages = computed(() => {
  const totalItems = companyStore.CompanyBySector?.length ?? 0
  return Math.ceil(totalItems / pageSize)
})

const paginatedCompanies = computed(() => {
  const allCompanies = companyStore.CompanyBySector ?? []
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return allCompanies.slice(start, end)
})

onMounted(async () => {
  await companyStore.getCompanyBySector(sectorId as string)
})

const viewCompany = (symbol: string) => {
  router.push({
    name: 'company.view',
    params: { symbol },
  })
}
</script>

<style scoped></style>
