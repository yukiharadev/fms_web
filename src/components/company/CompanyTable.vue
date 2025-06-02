<template>
  <v-card elevation="10" class="mx-auto my-6">
    <div class="flex justify-between items-center p-4">
      <v-card-title class="text-xl sm:text-2xl font-bold">Danh sách công ty</v-card-title>
      <div class="flex items-center gap-2">
        <v-text-field
          v-model="searchQuery"
          :prepend-inner-icon="$vuetify.display.smAndDown ? 'SearchIcon' : undefined"
          :label="$vuetify.display.smAndDown ? '' : 'Tìm kiếm công ty'"
          variant="outlined"
          @keyup.enter="handleSearchCompany"
          density="compact"
          color="primary"
          class="w-[150px] sm:w-[200px] mt-6"
        />
        <v-btn color="primary" @click="openAddCompanyDrawer">
          <PlusIcon size="20" stroke-width="1.5" />
          <span v-if="!$vuetify.display.smAndDown" class="text-sm sm:text-base">Thêm công ty</span>
        </v-btn>
      </div>
    </div>
    <v-divider></v-divider>
    <v-table flat>
      <thead>
        <tr>
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

        <tr v-else-if="!displayedCompanies.length">
          <td colspan="5" class="text-center text-base">Không có công ty nào để hiển thị</td>
        </tr>

        <tr v-else v-for="(item, index) in displayedCompanies" :key="index">
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
              @click="EditCompany(item.symbol)"
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
    <v-card-actions class="justify-center mt-4" v-if="!companyResult || !companyResult.length">
      <v-pagination v-model="currentPage" :length="totalPages" :total-visible="5" color="primary" />
    </v-card-actions>
    <v-divider></v-divider>
    <AddCompanyDrawer
      v-model:drawer="drawer"
      @close="drawer = false"
      @created:company="handleCreated"
    />
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { PlusIcon, EyeIcon, EditIcon, XIcon } from 'vue-tabler-icons'
import AddCompanyDrawer from './AddCompanyDrawer.vue'
import type { CompanyPageResponse, CompanyResponse } from '@/types/company'
import CompanyStore from '@/stores/company'

const company = ref<CompanyPageResponse[] | null>(null)
const searchQuery = ref<string>('')
const companyResult = ref<CompanyResponse[] | null>(null)

const openAddCompanyDrawer = () => {
  drawer.value = true
}

const router = useRouter()
const companyStore = CompanyStore()

const currentPage = ref(1)
const totalRecord = ref(1515)
const pageSize = ref(15)

const totalPages = computed(() => Math.ceil(totalRecord.value / pageSize.value))

const fetchCompanies = async () => {
  await companyStore.getPageCompanies(currentPage.value - 1, pageSize.value)
  company.value = companyStore.getPageCompany
}

const handleCreated = () => {
  fetchCompanies()
}

const EditCompany = (symbol: string) => {
  router.push({
    name: 'company.edit',
    params: { symbol },
  })
}

onMounted(fetchCompanies)
watch(currentPage, fetchCompanies)

const viewCompany = (symbol: string) =>
  router.push({
    name: 'company.view',
    params: { symbol },
  })

const drawer = ref(false)

const handleSearchCompany = async () => {
  if (!searchQuery.value) {
    await fetchCompanies()
    companyResult.value = null
    return
  }
  await companyStore.getSearchCompany(searchQuery.value)
  companyResult.value = companyStore.SearchCompany
}

const displayedCompanies = computed(() => {
  if (companyStore.error?.status === 404) {
    console.log(companyStore.error)
    return company.value ?? []
  }
  if (companyResult.value?.length) {
    return companyResult.value
  } else {
    return company.value ?? []
  }
})
</script>
