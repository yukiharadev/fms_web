<template>
  <div>
    <v-card class="absolute top-10">
      <v-card-title class="h3 italic">Chỉnh sửa thông tin công ty</v-card-title>

      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="6" md="2">
              <v-img
                class="mb-4 justify-center rounded-lg shadow-md bg-white object-contain"
                width="300"
                :src="showUrl || 'https://placehold.co/350x350?text=Logo'"
                @click="triggerFileInput"
                style="cursor: pointer"
              />
              <input ref="fileInput" type="file" style="display: none" @change="handleUploadLogo" />
            </v-col>
            <v-col>
              <v-row>
                <v-col cols="12" md="2">
                  <v-label class="ml-1 font-bold">Mã công ty</v-label>
                  <v-text-field color="primary" outlined v-model="form.symbol" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-label class="ml-1 font-bold">Tên công ty</v-label>
                  <v-text-field color="primary" outlined v-model="form.companyName" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-label class="ml-1 font-bold">Địa chỉ</v-label>
                  <v-text-field color="primary" outlined v-model="form.address" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-label class="ml-1 font-bold">Số điện thoại</v-label>
                  <v-text-field color="primary" outlined v-model="form.phoneNumber" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-label class="ml-1 font-bold">Email</v-label>
                  <v-text-field color="primary" outlined v-model="form.email" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-label class="ml-1 font-bold">Website</v-label>
                  <v-text-field color="primary" outlined v-model="form.website" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-label class="ml-1 font-bold">Tax</v-label>
                  <v-text-field color="primary" outlined v-model="form.taxCode" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-label class="ml-1 font-bold">KLCP</v-label>
                  <v-text-field color="primary" outlined v-model="form.listedShares" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-label class="ml-1 font-bold">Thể loại</v-label>
                  <v-select
                    color="primary"
                    outlined
                    v-model="form.sectorId"
                    :items="sectors"
                    item-title="name"
                    item-value="id"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-col>
            <v-label class="ml-1 font-bold"> Mô tả </v-label>
            <v-textarea color="primary" auto-grow v-model="form.description" />
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="handleUpdateCompany">Cập nhật</v-btn>
        </v-card-actions>
      </v-card>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import CompanyStore from '@/stores/company'
import type { UpdateCompanyRequest } from '@/types/company'
import useSectorStore from '@/stores/sector'
import useUploadStore from '@/stores/upload'
import { isValidURL } from '@/utils/middlewares'

const fileInput = ref<HTMLInputElement | null>(null)

const router = useRouter()
const companyStore = CompanyStore()
const sectorStore = useSectorStore()
const uploadStore = useUploadStore()
const showUrl = ref<string>('')

const symbol = ref<string>(
  Array.isArray(router.currentRoute.value.params.symbol)
    ? router.currentRoute.value.params.symbol[0]
    : router.currentRoute.value.params.symbol || '',
)

const sectors = computed(() => sectorStore.getSector?.value)

const form = ref<UpdateCompanyRequest>({
  id: '',
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

const triggerFileInput = () => {
  fileInput.value?.click()
}

const getCompanyDetail = async () => {
  if (!symbol.value) {
    console.error('Symbol is empty')
    return
  }

  try {
    await companyStore.getCompanyDetailBySymbol(symbol.value)
    const company = companyStore.getCompanyDetail

    if (company) {
      form.value = {
        id: company.company.id ?? '',
        symbol: company.company.symbol ?? '',
        companyName: company.company.companyName ?? '',
        address: company.company.address ?? '',
        taxCode: company.company.taxCode ?? '',
        phoneNumber: company.company.phoneNumber ?? '',
        email: company.company.email ?? '',
        website: company.company.website ?? '',
        sectorId: company.sector.id ?? '',
        logoUrl: company.company.logoUrl ?? '',
        listedShares: company.company.listedShares ?? 0,
        description: company.company.description ?? '',
      }
      await getLogoUrl()
    } else {
      console.error('Company data is null')
    }
  } catch (error) {
    console.error('Error fetching company detail:', error)
  }
}

const getLogoUrl = async () => {
  if (isValidURL(form.value.logoUrl)) {
    showUrl.value = form.value.logoUrl
  } else {
    await uploadStore.URLFromKey(form.value.logoUrl)
    showUrl.value = uploadStore.getURL?.fullSize ?? ''
  }
}

const handleUploadLogo = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) {
    console.error('No file selected')
    return
  }

  try {
    uploadStore.uploadGCSFile(file)
    if (uploadStore.upload) {
      form.value.logoUrl = uploadStore.upload.key
      await getLogoUrl()
    }
  } catch (error) {
    console.error('Error uploading logo:', error)
  }
}

const handleUpdateCompany = async () => {
  try {
    console.log(form.value)
    await companyStore.updateCompany(form.value)
  } catch (error) {
    console.error('Error updating company:', error)
  }
}

onBeforeMount(async () => {
  await sectorStore.getAllSectors()
  await getCompanyDetail()
})
</script>
