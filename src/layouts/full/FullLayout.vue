<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainView from './Main.vue'
</script>

<template>
  <v-locale-provider>
    <v-app>
      <MainView />
      <v-main>
        <v-container fluid class="relative">
          <div class="absolute top-15 left-5 right-5">
            <RouterView />
          </div>
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
