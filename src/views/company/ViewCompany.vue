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
              :src="company?.company.logoUrl ?? 'https://placehold.co/350x350?text=Logo'"
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
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref, computed, watch } from 'vue'
import CompanyStore from '@/stores/company'
import type { FlattenedLeadership, CompanyLeadershipResponse } from '@/types/company'

const router = useRouter()
const companyStore = CompanyStore()

const symbol = ref<string>(
  Array.isArray(router.currentRoute.value.params.symbol)
    ? router.currentRoute.value.params.symbol[0]
    : router.currentRoute.value.params.symbol || '',
)

const company = computed(() => companyStore.getCompanyDetail)
const leadership = computed(() => companyStore.getLeadership)

const getLeadership = async (companyId: string) => {
  try {
    await companyStore.getCompanyLeadership(companyId)
  } catch (error) {
    console.error('Error fetching company leadership:', error)
  }
}

const handleViewPersonDetail = (personId: string) => {
  router.push({
    name: 'person-detail',
    params: {
      id: personId,
    },
  })
}

const getCompanyDetail = async () => {
  if (!symbol.value) {
    console.error('Symbol is empty')
    return
  }

  try {
    await companyStore.getCompanyDetailBySymbol(symbol.value)
  } catch (error) {
    console.error('Error fetching company detail:', error)
  }
}

onMounted(async () => {
  console.log('Symbol:', symbol.value)
  await getCompanyDetail()
  if (company.value?.company.id) {
    await getLeadership(company.value.company.id)
    console.log('Leadership after fetch:', leadership.value)
    console.log('LeadershipData after fetch:', leadershipData.value)
  }
})

watch(leadership, (newVal) => {
  console.log('Leadership updated:', newVal)
})

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
      console.warn('Department missing positions:', department)
      return acc
    }

    department.positions.forEach((posi) => {
      if (!posi.employees || !Array.isArray(posi.employees)) {
        console.warn('Position missing employees:', posi)
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
