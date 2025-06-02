<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import defaultAvatar from '@/assets/images/users/avatar-1.jpg'
import useAuthStore from '@/stores/auth'

import { useRouter } from 'vue-router'

const menu = ref(false)
const dateTimePicker = ref<Date>(new Date())
const image = ref(defaultAvatar)
const birthDay = ref<string>('')

const router = useRouter()

onMounted(() => {
  const authStore = useAuthStore()
  if (authStore.isAuthenticated) {
    router.push({ name: 'Dashboard' })
  }
})

const formatDate = computed(() => {
  const date = new Date(dateTimePicker.value)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  birthDay.value = `${day}/${month}/${year}`
  return birthDay.value
})

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement

  if (target.files && target.files[0]) {
    const file = target.files[0]
    image.value = URL.createObjectURL(file)

    console.log('Selected file:', image.value)
  }
}
</script>

<template>
  <v-row class="flex mb-3">
    <v-col class="flex justify-center">
      <label for="fileInput">
        <v-avatar size="100" :image="image" class="cursor-pointer"></v-avatar>
      </label>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      />
    </v-col>
    <v-col cols="12">
      <v-label class="font-bold mb-1">Full Name</v-label>
      <v-text-field variant="outlined" hide-details color="primary"></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-label class="font-bold mb-1">UserName</v-label>
      <v-text-field variant="outlined" type="text" hide-details color="primary"></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-label class="font-bold mb-1">Email Address</v-label>
      <v-text-field variant="outlined" type="email" hide-details color="primary"></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-label class="font-bold mb-1">Password</v-label>
      <v-text-field variant="outlined" type="password" hide-details color="primary"></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-label class="font-bold mb-1">BirthDay</v-label>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template #activator="{ props }">
          <v-text-field
            v-bind="props"
            :value="formatDate"
            variant="outlined"
            hide-details
            color="primary"
            readonly
            placeholder="DD/MM/YYYY"
            class="mb-4"
          ></v-text-field>
        </template>
        <v-date-picker
          title="Ngày sinh"
          color="teal"
          elevation="2"
          v-model="dateTimePicker"
          @update:modelValue="menu = false"
          class="border-2 border-teal-600 rounded-lg"
        ></v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="12">
      <v-btn to="/" color="primary" size="large" block flat class="bg-primary">Sign up</v-btn>
    </v-col>
  </v-row>
</template>

<style scoped></style>
