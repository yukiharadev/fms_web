<script setup lang="ts">
import useSectorStore from '@/stores/sector'
import type { SectorPercentageResponse } from '@/types/sectors'
import { computed, onMounted, ref } from 'vue'

const sectorStore = useSectorStore()
const sectorPercentage = ref<SectorPercentageResponse[]>([])

const fetchSectorPercentage = async () => {
  await sectorStore.getSectorPercentage()
  sectorPercentage.value = sectorStore.getPercentage ?? []
}

onMounted(fetchSectorPercentage)

function generateColorFromLabel(label: string) {
  let hash = 0
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash)
  }
  const color =
    '#' +
    ((hash >> 24) & 0xff).toString(16).padStart(2, '0') +
    ((hash >> 16) & 0xff).toString(16).padStart(2, '0') +
    ((hash >> 8) & 0xff).toString(16).padStart(2, '0')
  return color
}

const topSectors = computed(() => sectorPercentage.value.slice(0, 9))
const otherSectors = computed(() => sectorPercentage.value.slice(9))

const labels = computed(() => [...topSectors.value.map((item) => item.sectorName), 'Khác'])

const series = computed(() => {
  const topPercentages = topSectors.value.map((item) => item.percentage)
  const otherTotal = otherSectors.value.reduce((sum, item) => sum + item.percentage, 0)
  return [...topPercentages, parseFloat(otherTotal.toFixed(2))]
})

const colors = computed(() => labels.value.map((label) => generateColorFromLabel(label)))

const totalCompanyCount = computed(() =>
  sectorPercentage.value.reduce((sum, item) => sum + item.companyCount, 0),
)

const chartOptions = computed(() => ({
  labels: labels.value,
  chart: {
    type: 'donut',
    fontFamily: 'inherit',
    foreColor: '#a1aab2',
    toolbar: { show: false },
  },
  colors: colors.value,
  plotOptions: {
    pie: {
      startAngle: 0,
      endAngle: 360,
      donut: {
        size: '75%',
        background: 'transparent',
      },
    },
  },
  stroke: { show: false },
  dataLabels: { enabled: false },
  legend: { show: false },
  tooltip: {
    theme: 'light',
    fillSeriesColor: false,
    y: {
      formatter: (val: number) => `${val.toFixed(2)}%`,
    },
  },
}))
</script>

<template>
  <v-card elevation="10" class="withbg">
    <v-card-item>
      <div class="d-sm-flex align-center justify-space-between pt-sm-2">
        <v-card-title class="text-h5">Tỷ lệ công ty theo ngành</v-card-title>
      </div>
      <div class="d-flex flex-column align-center">
        <apexchart type="donut" height="145" :options="chartOptions" :series="series" />
        <div class="mt-3 text-subtitle-1 text-muted">Tổng số công ty: {{ totalCompanyCount }}</div>
      </div>
    </v-card-item>
  </v-card>
</template>
