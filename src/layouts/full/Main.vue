<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import sidebarItems from './vertical-sidebar/sidebarItem'
import NavGroup from './vertical-sidebar/NavGroup/index.vue'
import NavItem from './vertical-sidebar/NavItem/index.vue'
import Logo from './logo/Logo.vue'
import { Menu2Icon } from 'vue-tabler-icons'
import NotificationDD from './vertical-header/NotificationDD.vue'
import ProfileDD from './vertical-header/ProfileDD.vue'
import NavCollapse from './vertical-sidebar/NavCollapse/NavCollapse.vue'
const sidebarMenu = shallowRef(sidebarItems)
const sDrawer = ref(true)
</script>

<template>
  <v-navigation-drawer
    left
    elevation="1"
    app
    class="leftSidebar fixed z-100 top-0!important"
    :width="270"
    v-model="sDrawer"
  >
    <div class="pa-5">
      <Logo />
    </div>

    <div>
      <perfect-scrollbar class="scrollnavbar">
        <v-list class="pa-6">
          <template v-for="(item, i) in sidebarMenu">
            <NavGroup :item="item" v-if="item.header" :key="item.title" />
            <NavCollapse class="leftPadding" :item="item" :level="0" v-else-if="item.children" />
            <NavItem :item="item" v-else class="leftPadding" />
          </template>
        </v-list>
      </perfect-scrollbar>
    </div>
  </v-navigation-drawer>
  <v-app-bar elevation="10" height="70" class="top-header z-50! fixed!">
    <div class="d-flex align-center justify-space-between z-50 w-100">
      <div>
        <v-btn
          class="hidden-lg-and-up ms-md-3 ms-sm-5 ms-3 text-muted"
          @click="sDrawer = !sDrawer"
          icon
          variant="flat"
          size="small"
        >
          <Menu2Icon size="20" stroke-width="1.5" />
        </v-btn>
      </div>
      <div class="d-flex align-center">
        <NotificationDD />
        <ProfileDD />
      </div>
    </div>
  </v-app-bar>
</template>
