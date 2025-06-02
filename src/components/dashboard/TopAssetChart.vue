<script setup lang="ts">
import CompanyStore from '@/stores/company'
import type { TopAssetsResponse } from '@/types/company'
import { ref, computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const primary = theme.current.value.colors.primary

const top10Assets = ref<TopAssetsResponse[]>([])

const companyStore = CompanyStore()

const fetchTopAssets = async () => {
  await companyStore.getTopAsset()
  top10Assets.value = companyStore.getTopAssets ?? []
}

onMounted(fetchTopAssets)

const chartOptions = computed(() => {
  return {
    series: [
      {
        name: 'Tổng tài sản (tỷ VNĐ)',
        data: top10Assets.value.map((item) => (item.value / 1000).toFixed(2)),
      },
    ],
    chartOptions: {
      chart: {
        type: 'bar',
        height: 370,
        toolbar: { show: false },
        fontFamily: 'inherit',
        foreColor: '#adb0bb',
        sparkline: { enabled: false },
      },
      colors: [primary],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '45%',
          borderRadius: 6,
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: top10Assets.value.map((item) => item.symbol),
        labels: {
          rotate: -25,
          style: { cssClass: 'text-muted text-sm' },
        },
      },
      yaxis: {
        min: 0,
        tickAmount: 5,
        title: {
          text: 'Nghìn tỷ VNĐ',
        },
        labels: {
          formatter: (val: number) => `${val}`,
          style: { cssClass: 'text-muted text-sm' },
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${(val * 1000).toLocaleString()} tỷ VNĐ`,
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 4,
              },
            },
            xaxis: {
              labels: {
                rotate: -45,
              },
            },
          },
        },
      ],
    },
  }
})
</script>

<template>
  <v-card elevation="10" class="withbg">
    <v-card-item>
      <div class="d-flex align-center justify-space-between pt-sm-2">
        <v-card-title class="text-h5">Top 10 công ty có tổng tài sản cao nhất</v-card-title>
      </div>
      <div class="mt-6">
        <apexchart
          type="bar"
          height="370px"
          :options="chartOptions.chartOptions"
          :series="chartOptions.series"
        />
      </div>
    </v-card-item>
  </v-card>
</template>
