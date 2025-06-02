<script setup lang="ts">
import TopAssetChart from '@/components/dashboard/TopAssetChart.vue'
import CompanyPercentage from '@/components/dashboard/CompanyPercentage.vue'
import FinanceReport from '@/components/dashboard/FinanceReport.vue'
import SectorPercentageTable from '@/components/dashboard/SectorPercentageTable.vue'
</script>
<template>
  <v-row class="absolute top-10">
    <v-col cols="12">
      <v-row>
        <v-col cols="12" lg="8">
          <TopAssetChart />
        </v-col>
        <v-col cols="12" lg="4">
          <div class="mb-6">
            <CompanyPercentage />
          </div>
          <div>
            <FinanceReport />
          </div>
        </v-col>
        <v-col cols="12" lg="12">
          <SectorPercentageTable />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
