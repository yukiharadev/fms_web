<template>
  <v-card>
    <v-card-title>Thông tin CEO</v-card-title>
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-img
              class="mb-4 justify-center rounded-lg shadow-md bg-white object-contain"
              width="200"
              :src="person?.avatarUrl ?? 'https://placehold.co/350x350?text=Logo'"
            ></v-img>
          </v-col>
          <v-col>
            <v-row>
              <v-col cols="12" md="12">
                <v-label class="ml-1 font-bold">Tên</v-label>
                <v-text-field color="primary" outlined :value="person?.fullName" readonly />
              </v-col>
              <v-col cols="12" md="12">
                <v-label class="ml-1 font-bold">Ngày sinh</v-label>
                <v-text-field
                  color="primary"
                  outlined
                  :value="person?.birthDay ?? 'Không có dữ liệu'"
                  readonly
                />
              </v-col>
              <v-col cols="12" md="12">
                <v-label class="ml-1 font-bold">Địa chỉ</v-label>
                <v-text-field
                  color="primary"
                  outlined
                  :value="person?.address ?? 'Không có dữ liệu'"
                  readonly
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-col>
          <v-label class="ml-1 font-bold">Mô tả</v-label>
          <v-textarea
            color="primary"
            outlined
            :value="person?.description ?? 'Không có dữ liệu'"
            readonly
          ></v-textarea>
        </v-col>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import CompanyStore from '@/stores/company'
import { computed, onMounted, ref } from 'vue'
import type { PersonRespone } from '@/types/company'

const route = useRoute()
const personId = route.params.id as string
const person = ref<PersonRespone | null>(null)

const companyStore = CompanyStore()

onMounted(async () => {
  await companyStore.getPersonDetail(personId)
  person.value = companyStore.getPersonDetails
})
</script>

<style scoped></style>
