<template>
  <v-navigation-drawer
    v-model="localDrawer"
    temporary
    location="right"
    width="800"
    class="business-sector-drawer h-100vh"
    :style="{ backgroundColor: 'white' }"
  >
    <v-card>
      <v-card-title class="text-h4 my-3">Thêm lĩnh vực kinh doanh</v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="valid" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="name"
            label="Tên lĩnh vực"
            :rules="[(v) => !!v || 'Tên lĩnh vực là bắt buộc']"
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="!valid" :loading="isSubmitting" @click="handleSubmit" color="primary"
          >Lưu</v-btn
        >
        <v-btn @click="closeDrawer" color="grey">Hủy</v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue'
import useSectorStore from '@/stores/sector'

const sectorStore = useSectorStore()

interface Props {
  drawer: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['update:drawer', 'create:sector'])

const localDrawer = computed({
  get: () => props.drawer,
  set: (value) => emit('update:drawer', value),
})

const formRef = ref()
const valid = ref(false)
const isSubmitting = ref(false)

const name = ref('')

const handleSubmit = async () => {
  const isValid = await formRef.value?.validate()
  console.log(isValid)
  if (!isValid) return

  isSubmitting.value = true
  await sectorStore.createBusinessSector({ name: name.value })
  isSubmitting.value = false

  if (sectorStore.createSectorSuccess) {
    emit('create:sector')
    closeDrawer()
  }
}

const closeDrawer = () => {
  emit('update:drawer', false)
  name.value = ''
}
</script>
