<template>
  <v-card elevation="10" class="mx-auto my-6">
    <div class="d-flex justify-space-between align-center pa-4">
      <v-card-title>Danh sách lĩnh vực kinh doanh</v-card-title>
      <v-btn @click="openAddSectorDrawer" color="primary">Thêm lĩnh vực</v-btn>
    </div>
    <v-divider></v-divider>
    <v-card flat>
      <v-table>
        <thead>
          <tr>
            <th class="text-subtitle-1 font-weight-bold">STT</th>
            <th class="text-subtitle-1 font-weight-bold">Tên lĩnh vực</th>
            <th class="text-subtitle-1 font-weight-bold">Slug</th>
            <th class="text-subtitle-1 font-weight-bold text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sector, index) in paginatedSectors" :key="sector.id">
            <td class="text-body-1">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td class="text-body-1">{{ sector.name }}</td>
            <td class="text-body-1 w-[480px]">{{ sector.slug }}</td>
            <td class="text-center">
              <v-btn
                class="text-h6 mx-2 my-1 text-right"
                color="primary"
                variant="tonal"
                size="small"
                @click="editSector(sector)"
              >
                <EditIcon size="20" stroke-width="1.5" />
              </v-btn>
              <v-btn
                class="text-h6 mx-2 my-1 text-right"
                color="error"
                variant="tonal"
                size="small"
                @click="deleteSector(sector.id)"
              >
                <TrashIcon size="20" stroke-width="1.5" />
              </v-btn>
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
    </v-card>
    <v-divider></v-divider>
    <AddSectorDrawer
      v-model:drawer="drawer"
      @close="drawer = false"
      @create:sector="handleCreateSector"
    />

    <v-snackbar location="top right" v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      <div class="d-flex align-center">
        <InfoCircleIcon class="mr-1" />
        {{ snackbar.message }}
      </div>
    </v-snackbar>
  </v-card>
  <v-dialog v-model="editSectorDialog" width="500" persistent>
    <v-card>
      <v-card-title>Chỉnh sửa lĩnh vực</v-card-title>
      <v-card-text>
        <v-text-field v-model="formData.name" label="Tên lĩnh vực" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="saveEditSector">Lưu</v-btn>
        <v-btn color="error" @click="editSectorDialog = false">Hủy</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import AddSectorDrawer from '@/components/business_sector/add_sector_drawer.vue'
import { InfoCircleIcon, EditIcon, TrashIcon } from 'vue-tabler-icons'
import type { Sector, SectorsResponse } from '@/types/sectors'
import useSectorStore from '@/stores/sector'

const sectors = ref<SectorsResponse['value']>([])
const sectorsStore = useSectorStore()
const editSectorDialog = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10

const formData = reactive({
  id: '',
  name: '',
})

const paginatedSectors = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sectors.value.slice(start, end)
})

const fetchAllSectors = async () => {
  await sectorsStore.getAllSectors()
  sectors.value = sectorsStore.sector?.value || []
  sectors.value.sort((a, b) => a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' }))
}

const totalPages = computed(() => {
  return Math.ceil(sectors.value.length / itemsPerPage)
})

const deleteSector = async (id: string) => {
  await sectorsStore.deleteBusinessSector(id)
  if (sectorsStore.deleteSectorSuccess) {
    await fetchAllSectors()
    snackbar.value.show = true
    snackbar.value.message = 'Xóa lĩnh vực thành công'
    snackbar.value.color = 'success'
  } else {
    snackbar.value.show = true
    snackbar.value.message = 'Xóa lĩnh vực thất bại'
    snackbar.value.color = 'error'
  }
}

onMounted(async () => {
  await fetchAllSectors()
  console.log('Sectors:', sectors.value)
})

const drawer = ref(false)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const openAddSectorDrawer = () => {
  drawer.value = true
}

const handleCreateSector = async () => {
  await fetchAllSectors()
  if (sectorsStore.createSectorSuccess) {
    sectors.value = sectorsStore.sector?.value || []
    sectors.value.sort((a, b) => a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' }))
    snackbar.value.show = true
    snackbar.value.message = 'Thêm lĩnh vực thành công'
    snackbar.value.color = 'success'
  } else {
    snackbar.value.show = true
    snackbar.value.message = 'Thêm lĩnh vực thất bại'
    snackbar.value.color = 'error'
  }
}

const editSector = (sector: Sector) => {
  formData.id = sector.id
  formData.name = sector.name
  editSectorDialog.value = true
}

const saveEditSector = async () => {
  await sectorsStore.updateBusinessSector({
    id: formData.id,
    name: formData.name,
  })
  if (sectorsStore.updateSectorSuccess) {
    await fetchAllSectors()
    snackbar.value.show = true
    snackbar.value.message = 'Cập nhật lĩnh vực thành công'
    snackbar.value.color = 'success'
    editSectorDialog.value = false
  } else {
    snackbar.value.show = true
    snackbar.value.message = 'Cập nhật lĩnh vực thất bại'
    snackbar.value.color = 'error'
  }
}
</script>
