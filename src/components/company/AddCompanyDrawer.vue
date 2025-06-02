<template>
  <v-navigation-drawer
    v-model="localDrawer"
    temporary
    location="right"
    width="800"
    class="company-drawer h-100vh"
    :style="{ backgroundColor: 'white' }"
  >
    <v-card elevation="10" class="mx-auto my-6">
      <v-card-title> Thêm công ty </v-card-title>
      <v-divider></v-divider>
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field color="primary" outlined label="Symbol" v-model="form.symbol" />
            </v-col>
            <v-col cols="12" md="8">
              <v-text-field
                color="primary"
                outlined
                label="Tên công ty"
                v-model="form.companyName"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                color="primary"
                outlined
                label="Khối lượng cổ phiếu"
                v-model="form.listedShares"
                type="number"
              />
            </v-col>
            <v-col cols="12" md="8">
              <v-text-field color="primary" outlined label="Địa chỉ" v-model="form.address" />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field color="primary" outlined label="Tax" v-model="form.taxCode" />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                color="primary"
                outlined
                label="Số điện thoại"
                v-model="form.phoneNumber"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field color="primary" outlined label="Email" v-model="form.email" />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field color="primary" outlined label="Website" v-model="form.website" />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                color="primary"
                outlined
                v-model="form.sectorId"
                :items="businessSectors"
                :item-title="(item) => item.name || 'Vui lòng chọn ngành'"
                :item-value="(item) => item.id"
                label="Ngành"
              />
            </v-col>

            <v-col cols="12" md="6">
              <div class="relative w-full">
                <input
                  id="file-upload"
                  type="file"
                  class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  @change="handleFileChange"
                />
                <div
                  class="flex rounded-md overflow-hidden border border-gray-400 bg-gray-100 text-black"
                >
                  <span class="px-8 py-4 bg-gray-300 text-sm font-semibold whitespace-nowrap">
                    Choose Image
                  </span>
                  <span class="flex-1 px-4 py-4 text-sm truncate text-gray-600">
                    {{ selectedFileName || 'Vui lòng chọn Avatar' }}
                  </span>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="12">
              <v-textarea color="primary" outlined label="Mô tả" v-model="form.description" />
            </v-col>
          </v-row>
          <div class="d-flex justify-end mt-4">
            <v-btn color="primary" @click="handleSubmitCreateCompany">Lưu lại</v-btn>
            <v-btn color="grey" class="ml-2" @click="closeDrawer">Hủy</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-card>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import CompanyStore from '@/stores/company'
import useUploadStore from '@/stores/upload'
import useSectorStore from '@/stores/sector'
import type { CreateCompanyRequest } from '@/types/company'
const uploadStore = useUploadStore()
const sectorStore = useSectorStore()
const companyStore = CompanyStore()

const form = ref<CreateCompanyRequest>({
  symbol: '',
  companyName: '',
  address: '',
  taxCode: '',
  phoneNumber: '',
  email: '',
  website: '',
  sectorId: '',
  logoUrl: '',
  listedShares: 0,
  description: '',
})

interface Props {
  drawer: boolean
}

const emit = defineEmits(['update:drawer', 'created:company'])

const businessSectors = computed(() => {
  console.log(sectorStore.getSector)
  return sectorStore.getSector?.value
})

onMounted(() => {
  sectorStore.getAllSectors()
})

watch(
  () => form.value.logoUrl,
  (newVal) => {
    console.log(newVal)
  },
)

const props = defineProps<Props>()

const localDrawer = computed({
  get: () => props.drawer,
  set: (value) => emit('update:drawer', value),
})

const selectedFileName = ref('')

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedFileName.value = file.name
    await uploadStore.uploadGCSFile(file)

    if (uploadStore.getUpload) {
      form.value.logoUrl = uploadStore.getUpload.key
      console.log(form.value.logoUrl)
    }
  }
}

const resetForm = () => {
  form.value = {
    symbol: '',
    companyName: '',
    address: '',
    taxCode: '',
    phoneNumber: '',
    email: '',
    website: '',
    sectorId: '',
    logoUrl: '',
    listedShares: 0,
    description: '',
  }
}

const handleSubmitCreateCompany = async () => {
  console.log(form.value)
  await companyStore.createCompany(form.value)
  emit('created:company')
}

const closeDrawer = async () => {
  if (form.value.logoUrl !== '') {
    await uploadStore.deleteGCSUpload(form.value.logoUrl)
    console.log('deleteSuccess')
  }

  localDrawer.value = false
  resetForm()
}
</script>
