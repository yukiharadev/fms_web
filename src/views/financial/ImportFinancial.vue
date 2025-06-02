<template>
  <div class="absolute top-10 left-2 right-2">
    <v-card elevation="2" class="w-full">
      <v-card-title>Tải lên báo cáo tài chính</v-card-title>
      <v-card>
        <v-card-text>
          <div class="mb-4">
            <v-btn color="primary" @click="isDialogActive = true">Tải lên</v-btn>
          </div>
          <ul>
            <li class="font-bold">Hướng dẫn tải lên dữ liệu</li>
            <li>
              Format dữ liệu theo định dạng
              <a href="/public/demo/import.xlsx" target="_blank" class="text-blue-500">tại đây</a>
            </li>
            <li>Chọn tệp báo cáo tài chính</li>
            <li>Nhấn nút "Tải lên"</li>
            <li>Chờ cho đến khi quá trình tải lên hoàn tất</li>
          </ul>
          <p class="text-red-500 font-bold mt-4">
            Lưu ý: Tệp báo cáo tài chính phải có định dạng .xlsx
          </p>
        </v-card-text>
      </v-card>
    </v-card>

    <v-card class="mt-4">
      <div class="flex justify-between items-center p-2">
        <v-card-title class="text-xl sm:text-2xl font-bold">Tra cứu tại đây</v-card-title>
        <div class="flex items-center gap-2 mr-4">
          <v-select
            v-model="quarter"
            :items="quarters"
            item-title="text"
            item-value="value"
            placeholder="Quý"
            variant="outlined"
            density="compact"
            color="primary"
            class="mt-6"
          />
          <div class="flex items-center gap-2">
            <v-btn class="mx-1 my-1" color="primary" variant="tonal" @click="year = year - 1">
              <ChevronLeftIcon size="20" stroke-width="1.5" />
            </v-btn>
            <span class="text-sm font-bold">{{ year }}</span>
            <v-btn class="mx-1 my-1" color="primary" variant="tonal" @click="year = year + 1">
              <ChevronRightIcon size="20" stroke-width="1.5" />
            </v-btn>
          </div>
          <v-text-field
            v-model="search"
            label="Mã"
            variant="outlined"
            density="compact"
            color="primary"
            class="w-[70px] sm:w-[100px] mt-6"
          />
          <v-select
            v-model="selectedCategory"
            :items="categories"
            item-title="text"
            item-value="value"
            label="Chọn danh mục"
            variant="outlined"
            density="compact"
            color="primary"
            class="w-[150px] sm:w-[200px] mt-6"
          />
        </div>
      </div>
      <v-card>
        <v-data-table-virtual
          :headers="tableHeaders"
          :items="tableItems"
          item-key="categoryName"
          class="w-full"
          :fixed-header="true"
          :height="600"
          v-if="tableHeaders.length > 1"
        />
        <v-skeleton-loader v-else type="table" :height="600" />
      </v-card>
    </v-card>
  </div>

  <v-dialog v-model="isDialogActive" max-width="600">
    <v-card>
      <v-card-title>Chọn tệp báo cáo tài chính</v-card-title>
      <v-container>
        <div class="flex items-center justify-center w-full">
          <label
            for="dropzone-file"
            class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">XLSX only</p>
              <p v-if="selectedFileName" class="mt-2 text-sm text-gray-700">
                Selected: {{ selectedFileName }}
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              class="hidden"
              accept=".xlsx"
              @change="handleFileChange"
            />
          </label>
        </div>
      </v-container>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog">Hủy</v-btn>
        <v-btn
          color="primary"
          @click="uploadFileBulk"
          :loading="isUploading"
          :disabled="isUploading || !selectedFileName"
        >
          Tải lên
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar.show" location="top right" :color="snackbar.color" timeout="3000">
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from 'vue-tabler-icons'
import FinanceStore from '@/stores/finance'
import type { FinancialData } from '@/types/financial'
const selectedFile = ref<File | null>(null)
const selectedFileName = ref<string>('')
const isDialogActive = ref(false)
const isUploading = ref(false)
const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})
const search = ref('ACB')
const financeStore = FinanceStore()
const selectedCategory = ref<string>('bsheet')
const quarter = ref(4)
const year = ref(2024)

const quarters = ref([
  {
    value: 0,
    text: 'Theo Năm',
  },
  {
    value: 4,
    text: 'Theo quý',
  },
])

const financialData = ref<FinancialData>()

const categories = ref([
  {
    value: 'bsheet',
    text: 'Balance Sheet',
  },
  {
    value: 'incsta',
    text: 'Income Statement',
  },
  {
    value: 'cflow',
    text: 'Cash Flow Statement',
  },
])
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    if (file.name.endsWith('.xlsx')) {
      selectedFile.value = file
      selectedFileName.value = file.name
    } else {
      snackbar.value = {
        show: true,
        message: 'Vui lòng chọn tệp định dạng .xlsx',
        color: 'error',
      }
      selectedFile.value = null
      selectedFileName.value = ''
      input.value = ''
    }
  }
}

const closeDialog = () => {
  isDialogActive.value = false
  selectedFile.value = null
  selectedFileName.value = ''
  isUploading.value = false
}

const getFinancialData = async () => {
  await financeStore.getFinancialData(
    selectedCategory.value,
    search.value,
    quarter.value,
    year.value,
  )

  console.log(financeStore.financialData)
  financialData.value = financeStore.financialData
}

watch([search, selectedCategory, quarter, year], () => {
  getFinancialData()
})

const tableHeaders = computed(() => {
  const base = [{ text: 'Chỉ tiêu', title: '#', value: 'categoryName', width: 250 }]
  const others =
    financialData.value?.headers?.map((h, idx) => ({
      title: `${quarter.value === 0 ? h.year : `Q${quarter.value}/${h.year}`}`,
      text: `${quarter.value === 0 ? h.year : `Q${quarter.value}/${h.year}`}`,
      value: `quarter_${idx}`,
      key: `quarter_${idx}`,
      width: 120 as number,
    })) ?? []
  return base.concat(others)
})

const tableItems = computed(() => {
  return (
    financialData.value?.data.map((row) => {
      const values: Record<string, number> = {}
      row.value.forEach((val, idx) => {
        values[`quarter_${idx}`] = val
      })
      return {
        categoryName: row.categoryName,
        ...values,
      }
    }) ?? []
  )
})

onMounted(() => {
  getFinancialData()
})

const uploadFileBulk = async () => {
  isUploading.value = true
  console.log(selectedFile.value)
  await financeStore.uploadFinanceBulk(selectedFile.value as File)
  isUploading.value = false
  if (financeStore.getFinanceBulk) {
    snackbar.value = {
      show: true,
      message: 'Tải lên thành công',
      color: 'success',
    }
  } else {
    snackbar.value = {
      show: true,
      message: 'Tải lên thất bại, vui lòng thử lại sau hoặc format lại dữ liệu',
      color: 'error',
    }
  }
}
</script>

<style scoped></style>
