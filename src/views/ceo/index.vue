<template>
  <v-card class="absolute top-10">
    <v-card-title class="text-xl sm:text-2xl font-bold">
      <div class="d-flex justify-space-between">
        <span class="text-xl sm:text-2xl font-bold">Danh sách CEO</span>
        <div class="d-flex align-center">
          <v-text-field
            label="Tìm kiếm CEO"
            variant="outlined"
            clearable
            width="150"
            class="mr-2 relative top-3"
            density="compact"
            v-model="searchKeyword"
            @keyup.enter="handleSearchCeo(searchKeyword)"
          />
          <v-btn color="primary" variant="tonal" @click="addCeoDialog = true">Thêm CEO</v-btn>
        </div>
      </div>
    </v-card-title>
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
        <tr v-for="(item, index) in leadershipData" :key="index">
          <td class="text-subtitle-1">{{ index + 1 }}</td>
          <td class="text-subtitle-1">{{ item.fullName ?? 'Không có thông tin' }}</td>
          <td class="text-subtitle-1">{{ item.address ?? 'Không có thông tin' }}</td>
          <td class="text-subtitle-1">{{ item.residence ?? 'Không có thông tin' }}</td>
          <td class="text-center">
            <v-btn
              class="text-h6 mr-4 ml-2 text-right"
              color="primary"
              @click="viewCeo(getId(item.id))"
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
  <v-dialog v-model="addCeoDialog" width="500">
    <v-card>
      <v-card-title>Thêm CEO</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            label="Họ tên"
            variant="outlined"
            density="compact"
            v-model="ceoData.fullName"
          />
          <v-text-field
            label="Địa chỉ"
            variant="outlined"
            density="compact"
            v-model="ceoData.address"
          />
          <v-text-field
            label="Nơi ở"
            variant="outlined"
            density="compact"
            v-model="ceoData.residence"
          />
          <v-text-field
            label="Ngành"
            variant="outlined"
            density="compact"
            v-model="ceoData.sector"
          />
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                label="Ngày sinh"
                variant="outlined"
                density="compact"
                v-model="ceoData.birthDay"
                readonly
                v-bind="props"
              />
            </template>
            <v-date-picker
              v-model="rawDate"
              @update:modelValue="updateBirthDay"
              title="Chọn ngày sinh"
            />
          </v-menu>
          <v-select
            label="Giới tính"
            variant="outlined"
            density="compact"
            v-model="ceoData.gender"
            :items="[
              { name: 'Nam', value: 0 },
              { name: 'Nữ', value: 1 },
            ]"
            item-title="name"
            item-value="value"
          />
          <v-btn color="primary" variant="tonal" @click="uploadDialog = true">Tải lên</v-btn>

          <v-dialog v-model="uploadDialog" width="500">
            <v-card>
              <v-card-title>Tải lên ảnh</v-card-title>
              <v-card-text>
                <v-file-input
                  label="Ảnh đại diện"
                  variant="outlined"
                  density="compact"
                  v-model="avatarUrl"
                />
                <div class="d-flex gap-2 justify-end">
                  <v-btn color="primary" variant="tonal" @click="uploadAvatar(avatarUrl as File)"
                    >Tải lên</v-btn
                  >
                  <v-btn color="error" variant="tonal" @click="uploadDialog = false">Hủy</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" variant="tonal" @click="addCeo">Thêm</v-btn>
        <v-btn color="error" variant="tonal" @click="addCeoDialog = false">Hủy</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { PersonPageRespone, PersonRespone } from '@/types/company'
import { ref, onMounted, computed, watch } from 'vue'
import { EyeIcon, EditIcon, TrashIcon } from 'vue-tabler-icons'
import CeoStore from '@/stores/ceo'
import { useRouter } from 'vue-router'
import useUploadStore from '@/stores/upload'

const ceoStore = CeoStore()

const uploadStore = useUploadStore()
const router = useRouter()
const addCeoDialog = ref(false)
const searchKeyword = ref('')
const leadershipData = ref<PersonPageRespone[] | PersonRespone[]>([])
const currentPage = ref(1)
const size = ref(20)
const dateMenu = ref(false)
const rawDate = ref<string | null>(null)
const uploadDialog = ref(false)
const avatarUrl = ref<File | null>(null)

const ceoData = ref({
  fullName: '',
  address: '',
  residence: '',
  birthDay: '',
  gender: 0,
  avatarUrl: '',
  sector: '',
})

const updateBirthDay = (isoDate: string | null) => {
  if (isoDate) {
    const date = new Date(isoDate)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    ceoData.value.birthDay = `${day}/${month}/${year}`
  } else {
    ceoData.value.birthDay = ''
  }
  dateMenu.value = false
}

const uploadAvatar = async (file: File) => {
  const response = await uploadStore.uploadGCSFile(file)
  if (uploadStore.getUpload) {
    ceoData.value.avatarUrl = uploadStore.getUpload.fullSize
  }
  uploadDialog.value = false
}

const addCeo = async () => {
  console.log('CEO Data:', ceoData.value)
  await ceoStore.addCeoAction(ceoData.value)
  if (ceoStore.getAddCeo) {
    addCeoDialog.value = false
  }
  fetchAllCeo()
  ceoData.value = {
    fullName: '',
    address: '',
    residence: '',
    birthDay: '',
    gender: 0,
    avatarUrl: '',
    sector: '',
  }
  dateMenu.value = false
  rawDate.value = null
  avatarUrl.value = null
  addCeoDialog.value = false
}

const totalPages = computed(() => {
  const totalRecord = ceoStore.totalRecord
  return Math.ceil(totalRecord / size.value)
})

const getId = (id: any): string => {
  return typeof id === 'string' ? id : (id as { value: string }).value
}

const fetchAllCeo = async () => {
  await ceoStore.getPaginationCeo(currentPage.value - 1, size.value)
  leadershipData.value = (ceoStore.getCeo as PersonPageRespone[]) ?? []
  console.log(leadershipData.value)
}

const viewCeo = (id: string) => {
  router.push({
    name: 'person-detail',
    params: { id },
  })
}

const handleSearchCeo = async (keyword: string) => {
  if (keyword.trim()) {
    await ceoStore.getSeachCeoAction(keyword)
    leadershipData.value = (ceoStore.searchCeo as PersonRespone[]) ?? []
  } else {
    fetchAllCeo()
  }
}

watch(searchKeyword, (newKeyword) => {
  if (!newKeyword) {
    fetchAllCeo()
  }
})

onMounted(fetchAllCeo)
watch(currentPage, fetchAllCeo)
</script>
