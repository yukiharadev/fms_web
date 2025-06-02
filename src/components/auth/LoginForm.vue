<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useAuthStore from '@/stores/auth'

const authStore = useAuthStore()

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  await authStore.login({
    userName: email.value,
    password: password.value,
  })

  if (authStore.error) {
    snackbar.value.show = true
    snackbar.value.message = authStore.error
    snackbar.value.color = 'error'
  }

  if (authStore.isAuthenticated) {
    router.push({ name: 'Dashboard' })

    snackbar.value.show = true
    snackbar.value.message = 'Login successful'
    snackbar.value.color = 'success'
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push({ name: 'Dashboard' })
  }
})
</script>

<template>
  <v-row class="d-flex mb-3">
    <v-col cols="12">
      <v-label class="font-weight-bold mb-1">Email</v-label>
      <v-text-field variant="outlined" hide-details color="primary" v-model="email"></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-label class="font-weight-bold mb-1">Password</v-label>
      <v-text-field
        variant="outlined"
        type="password"
        hide-details
        color="primary"
        v-model="password"
      ></v-text-field>
    </v-col>
    <v-col cols="12" class="pt-0">
      <div class="d-flex flex-wrap align-center ml-2">
        <div class="ml-sm-auto">
          <RouterLink
            to="/"
            class="text-primary text-decoration-none text-body-1 font-weight-medium"
            >Forgot Password ?</RouterLink
          >
        </div>
      </div>
    </v-col>
    <v-col cols="12" class="pt-0">
      <v-btn @click="handleLogin" color="primary" size="large" block flat>Sign in</v-btn>
      <v-snackbar
        location="top right"
        v-model="snackbar.show"
        :color="snackbar.color"
        timeout="6000"
      >
        {{ snackbar.message }}
      </v-snackbar>
    </v-col>
  </v-row>
</template>
