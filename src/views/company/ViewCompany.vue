<template>
  <v-card>
    <v-card-title class="h3 italic">Chi tiết công ty</v-card-title>
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="6" md="2">
            <v-img
              class="mb-4 justify-center rounded-lg shadow-md bg-white object-contain"
              width="300"
              :src="avatarLogoUrl"
            ></v-img>
          </v-col>
          <v-col>
            <v-row>
              <v-col cols="12" md="2">
                <v-label class="ml-1 font-bold">Mã công ty</v-label>
                <v-text-field color="primary" outlined :value="company?.company.symbol" readonly />
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="ml-1 font-bold">Tên công ty</v-label>
                <v-text-field
                  color="primary"
                  outlined
                  :value="company?.company.companyName"
                  readonly
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="ml-1 font-bold">Địa chỉ</v-label>
                <v-text-field
                  color="primary"
                  outlined
                  :value="company?.company.address ?? 'Không có dữ liệu'"
                  readonly
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="ml-1 font-bold">Số điện thoại</v-label>
                <v-text-field
                  color="primary"
                  outlined
                  :value="company?.company.phoneNumber ?? 'Không có dữ liệu'"
                  readonly
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="ml-1 font-bold">Email</v-label>
                <v-text-field
                  color="primary"
                  readonly
                  outlined
                  :value="company?.company.email ?? 'Không có dữ liệu'"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="ml-1 font-bold">Website</v-label>
                <v-text-field
                  color="primary"
                  readonly
                  outlined
                  :value="company?.company.website ?? 'Không có dữ liệu'"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="ml-1 font-bold">Tax</v-label>
                <v-text-field
                  color="primary"
                  readonly
                  outlined
                  :value="company?.company.taxCode ?? 'Không có dữ liệu'"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="ml-1 font-bold">KLCP</v-label>
                <v-text-field
                  color="primary"
                  readonly
                  outlined
                  :value="company?.company.listedShares ?? 'Không có dữ liệu'"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-label class="ml-1 font-bold">Thể loại</v-label>
                <v-text-field
                  color="primary"
                  readonly
                  outlined
                  :value="company?.sector.name ?? 'Không có dữ liệu'"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-col>
          <v-label class="ml-1 font-bold"> Mô tả </v-label>
          <v-textarea
            :model-value="company?.company.description ?? 'Không có dữ liệu'"
            readonly
            color="primary"
            auto-grow
          ></v-textarea>
        </v-col>
        <v-col>
          <div class="d-flex justify-space-between">
            <v-card-title class="text-2xl italic font-bold">Danh sách chức vụ</v-card-title>
            <v-btn color="primary" variant="tonal" @click="addPositionDialog = true" size="small"
              >Thêm chức vụ</v-btn
            >
          </div>
          <v-table>
            <thead class="bg-primary text-white">
              <tr>
                <th class="text-subtitle-1 font-weight-bold">STT</th>
                <th class="text-subtitle-1 font-weight-bold">Phòng ban</th>
                <th class="text-subtitle-1 font-weight-bold">Chức vụ</th>
                <th class="text-subtitle-1 font-weight-bold text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in positionList" :key="item.id">
                <td class="text-subtitle-1">{{ index + 1 }}</td>
                <td class="text-subtitle-1">
                  {{ departmentMap[item.department as DepartmentKey] ?? item.department }}
                </td>
                <td class="text-subtitle-1">{{ item.name }}</td>
                <td class="text-center">
                  <v-btn
                    class="text-h6 text-right mr-2"
                    color="primary"
                    variant="tonal"
                    size="small"
                  >
                    <EditIcon size="20" stroke-width="1.5" />
                  </v-btn>
                  <v-btn
                    class="text-h6 text-right mr-2"
                    @click="handleDeletePosition(item.id)"
                    color="error"
                    variant="tonal"
                    size="small"
                  >
                    <TrashIcon size="20" stroke-width="1.5" />
                  </v-btn>
                </td>
              </tr>
              <tr v-if="!positionList || positionList.length === 0">
                <td colspan="4" class="text-center italic">Chưa có dữ liệu chức vụ</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
        <v-col>
          <v-card-title class="text-2xl italic font-bold">Danh sách lãnh đạo</v-card-title>
          <v-table>
            <thead class="bg-primary text-white">
              <tr>
                <th class="text-subtitle-1 font-weight-bold">Họ tên</th>
                <th class="text-subtitle-1 font-weight-bold">Phòng ban</th>
                <th class="text-subtitle-1 font-weight-bold">Chức vụ</th>
                <th class="text-subtitle-1 font-weight-bold text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in leadershipData" :key="item.employee_id">
                <td class="text-subtitle-1">{{ item.employee_name }}</td>
                <td class="text-subtitle-1">{{ item.department }}</td>
                <td class="text-subtitle-1">{{ item.position_name }}</td>
                <td class="text-center">
                  <v-btn
                    class="text-h6 mr-2 text-right"
                    color="primary"
                    variant="tonal"
                    size="small"
                    @click="handleViewPersonDetail(item.personId)"
                  >
                    <EyeIcon size="20" stroke-width="1.5" />
                  </v-btn>
                  <v-btn
                    class="text-h6 mr-2 text-right"
                    color="primary"
                    variant="tonal"
                    size="small"
                  >
                    <EditIcon size="20" stroke-width="1.5" />
                  </v-btn>
                  <v-btn class="text-h6 text-right" color="error" variant="tonal" size="small">
                    <TrashIcon size="20" stroke-width="1.5" />
                  </v-btn>
                </td>
              </tr>
              <tr v-if="leadershipData.length === 0">
                <td colspan="4" class="text-center italic">Chưa có dữ liệu lãnh đạo</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-card-text>
    </v-card>
  </v-card>

  <v-dialog v-model="addPositionDialog" width="500" persistent>
    <v-card>
      <v-card-title>Thêm chức vụ</v-card-title>
      <v-card-text>
        <v-select
          v-model="selectedDepartment"
          :items="
            Object.entries(departmentsMap).map(([key, value]) => ({
              value: Number(key),
              title: value,
            }))
          "
          item-title="title"
          item-value="value"
          label="Phòng ban"
          color="primary"
          outlined
        />
        <v-text-field v-model="positionName" label="Tên chức vụ" color="primary" outlined />
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" variant="tonal" @click="createPosition">Thêm</v-btn>
        <v-btn color="error" variant="tonal" @click="addPositionDialog = false">Hủy</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar location="top right" v-model="snackbar.show" :color="snackbar.color" timeout="3000">
    <div class="d-flex align-center">
      <InfoCircleIcon class="mr-1" />
      {{ snackbar.message }}
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref, computed, defineProps } from 'vue'
import CompanyStore from '@/stores/company'
import type { FlattenedLeadership, CompanyLeadershipResponse } from '@/types/company'
import { isValidURL } from '@/utils/middlewares'
import UploadStore from '@/stores/upload'
import { EyeIcon, EditIcon, TrashIcon, InfoCircleIcon } from 'vue-tabler-icons'
import PositionStore from '@/stores/position'

const props = defineProps<{
  symbol?: string
}>()

const router = useRouter()
const companyStore = CompanyStore()
const uploadStore = UploadStore()
const positionStore = PositionStore()

const avatarLogoUrl = ref<string>('https://placehold.co/350x350?text=Logo')
const addPositionDialog = ref<boolean>(false)
const selectedDepartment = ref<SelectedDepartmentKey>(1)
const positionName = ref<string>('')
const positionList = computed(() => positionStore.positionList)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const departmentsMap = {
  1: 'Hội đồng quản trị',
  2: 'Ban giám đốc/Kế toán trưởng',
  3: 'Ban kiểm toán',
  4: 'Khác',
} as const

type SelectedDepartmentKey = keyof typeof departmentsMap

const symbol = ref<string>(
  props.symbol ||
    (Array.isArray(router.currentRoute.value.params.symbol)
      ? router.currentRoute.value.params.symbol[0]
      : router.currentRoute.value.params.symbol || ''),
)

const company = computed(() => companyStore.getCompanyDetail)

const companyAvatarUrl = async (avatarUrl: string | null | undefined) => {
  const fallbackUrl = 'https://placehold.co/350x350?text=Logo'
  if (!avatarUrl) {
    avatarLogoUrl.value = fallbackUrl
    return avatarLogoUrl.value
  }

  if (isValidURL(avatarUrl)) {
    avatarLogoUrl.value = avatarUrl
  } else {
    try {
      await uploadStore.URLFromKey(avatarUrl)
      avatarLogoUrl.value = uploadStore.getURLFromKey?.fullSize ?? fallbackUrl
    } catch (error) {
      avatarLogoUrl.value = fallbackUrl
    }
  }
  return avatarLogoUrl.value
}

const leadership = computed(() => companyStore.getLeadership)

const getLeadership = async (companyId: string) => {
  try {
    await companyStore.getCompanyLeadership(companyId)
  } catch (error) {
    throw error
  }
}

const getPosition = async (companyId: string) => {
  try {
    await positionStore.getPositionAction(companyId)
  } catch (error) {
    throw error
  }
}

const createPosition = async () => {
  try {
    await positionStore.createPositionAction({
      companyId: company.value?.company.id ?? '',
      name: positionName.value,
      department: selectedDepartment.value,
    })
    await getPosition(company.value?.company.id ?? '')
    snackbar.value.show = true
    snackbar.value.message = 'Thêm chức vụ thành công'
    snackbar.value.color = 'success'
  } catch (error) {
    snackbar.value.show = true
    snackbar.value.message = 'Thêm chức vụ thất bại'
    snackbar.value.color = 'error'
  }

  addPositionDialog.value = false
  positionName.value = ''
  selectedDepartment.value = 1
}

const handleViewPersonDetail = (personId: string) => {
  router.push({
    name: 'person-detail',
    params: { id: personId },
  })
}

const getCompanyDetail = async () => {
  if (!symbol.value) {
    return
  }

  try {
    await companyStore.getCompanyDetailBySymbol(symbol.value)
  } catch (error) {
    throw error
  }
}

onMounted(async () => {
  await getCompanyDetail()
  if (company.value?.company.logoUrl) {
    await companyAvatarUrl(company.value.company.logoUrl)
  } else {
    avatarLogoUrl.value = 'https://placehold.co/350x350?text=Logo'
  }
  if (company.value?.company.id) {
    await getLeadership(company.value.company.id)
  }
  if (company.value?.company.id) {
    await getPosition(company.value.company.id)
  }
})

const handleDeletePosition = async (positionId: string) => {
  try {
    await positionStore.deletePositionAction(positionId)
    await getPosition(company.value?.company.id ?? '')
    snackbar.value.show = true
    snackbar.value.message = 'Xóa chức vụ thành công'
    snackbar.value.color = 'success'
  } catch (error) {
    snackbar.value.show = true
    snackbar.value.message = 'Xóa chức vụ thất bại'
    snackbar.value.color = 'error'
  }
}

const departmentMap = {
  BoardOfDirectors: 'Hội đồng quản trị',
  ExecutiveBoardOrChiefAccountant: 'Ban giám đốc/Kế toán trưởng',
  AuditCommittee: 'Ban kiểm toán',
  Others: 'Khác',
} as const

type DepartmentKey = keyof typeof departmentMap

const leadershipData = computed(() => {
  const rawData = leadership.value
  if (!rawData || !Array.isArray(rawData)) return []

  return rawData.reduce((acc: FlattenedLeadership[], department: CompanyLeadershipResponse) => {
    if (!department.positions || !Array.isArray(department.positions)) {
      return acc
    }

    department.positions.forEach((posi) => {
      if (!posi.employees || !Array.isArray(posi.employees)) {
        return
      }

      posi.employees.forEach((emp) => {
        acc.push({
          department:
            departmentMap[department.department as DepartmentKey] || department.department,
          position_id: posi.id,
          position_name: posi.name,
          employee_id: emp.id,
          personId: emp.personId,
          employee_name: emp.name,
        })
      })
    })

    return acc
  }, [])
})
</script>
