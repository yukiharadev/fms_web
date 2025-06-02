<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const primary = theme.current.value.colors.primary
const secondary = theme.current.value.colors.secondary

const areaChart = {
  series: [
    {
      name: 'Số báo cáo',
      data: [45, 60, 50, 78, 90, 110, 130],
    },
  ],
}

const areachartOptions = computed(() => ({
  labels: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7'],
  chart: {
    type: 'area',
    height: 60,
    fontFamily: 'inherit',
    foreColor: '#a1aab2',
    toolbar: { show: false },
    sparkline: { enabled: true },
    group: 'sparklines',
  },
  colors: [secondary],
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  fill: {
    type: 'solid',
    opacity: 0.1,
  },
  markers: { size: 0 },
  tooltip: {
    theme: 'light',
    x: { show: true },
  },
}))
</script>

<template>
  <v-card elevation="10" class="withbg">
    <v-card-item>
      <div class="d-flex align-center justify-space-between pt-sm-2">
        <v-card-title class="text-h5">Báo cáo tài chính</v-card-title>
      </div>

      <v-row>
        <v-col cols="12">
          <p class="text-h3">130</p>
          <p class="text-body-1">Dữ liệu tháng này</p>
        </v-col>
      </v-row>
    </v-card-item>

    <div>
      <apexchart type="area" height="100" :options="areachartOptions" :series="areaChart.series" />
    </div>
  </v-card>
</template>
