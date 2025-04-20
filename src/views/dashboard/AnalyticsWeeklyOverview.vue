<script setup lang="ts">
import { hexToRgb } from '@layouts/utils'
import { useTheme } from 'vuetify'
import { computed, watch, ref } from 'vue'

// Define props with type
const props = defineProps<{
  dailyTokens: number[]
  dates: string[]
  percentageChange: string
  isImproved: boolean
  daysWithSales: number
  avgWeeklyEarning: number
  avgDailyEarning: number
}>()

// Define emit for month selection
const emit = defineEmits<{
  (e: 'update:month', month: string): void
}>()

const vuetifyTheme = useTheme()

// Reactive series data
const series = ref([{ data: props.dailyTokens }])

// Watch for changes in dailyTokens and update series
watch(
  () => props.dailyTokens,
  (newTokens) => {
    series.value = [{ data: newTokens }]
  },
  { immediate: true }
)

// Year selection options (last 5 years)
const years = computed(() => {
  const currentYear = new Date().getFullYear()
  const options = []
  for (let i = 0; i < 5; i++) {
    const year = currentYear - i
    options.push({ title: String(year), value: year })
  }
  return options
})

// Month selection options (January to December)
const months = [
  { title: 'January', value: '01' },
  { title: 'February', value: '02' },
  { title: 'March', value: '03' },
  { title: 'April', value: '04' },
  { title: 'May', value: '05' },
  { title: 'June', value: '06' },
  { title: 'July', value: '07' },
  { title: 'August', value: '08' },
  { title: 'September', value: '09' },
  { title: 'October', value: '10' },
  { title: 'November', value: '11' },
  { title: 'December', value: '12' },
]

// Selected year and month
const selectedYear = ref<number | null>(new Date().getFullYear())
const selectedMonth = ref<string | null>(String(new Date().getMonth() + 1).padStart(2, '0'))

// Emit combined year-month when both are selected
watch([selectedYear, selectedMonth], ([newYear, newMonth]) => {
  if (newYear && newMonth) {
    emit('update:month', `${newYear}-${newMonth}`)
  }
})

// Reset month when year changes
watch(selectedYear, () => {
  selectedMonth.value = null // Reset month selection when year changes
})

// KHR formatter for earnings
const khrFormatter = new Intl.NumberFormat('km-KH', {
  style: 'currency',
  currency: 'KHR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const options = computed(() => {
  const currentTheme = ref(vuetifyTheme.current.value.colors)
  const variableTheme = ref(vuetifyTheme.current.value.variables)

  const disabledColor = `rgba(${hexToRgb(currentTheme.value['on-surface'])},${variableTheme.value['disabled-opacity']})`
  const borderColor = `rgba(${hexToRgb(String(variableTheme.value['border-color']))},${variableTheme.value['border-opacity']})`

  return {
    chart: {
      offsetY: -10,
      offsetX: -15,
      parentHeightOffset: 0,
      toolbar: { show: false },
      type: 'line', // Use line type for scatter with connected dots
    },
    stroke: {
      width: 2,
      colors: [currentTheme.value.primary],
      curve: 'straight', // Straight lines to connect dots
    },
    markers: {
      size: 4, // Show dots at data points
      colors: [currentTheme.value.primary],
      strokeColors: [currentTheme.value.surface],
      strokeWidth: 2,
    },
    legend: { show: false },
    grid: {
      borderColor,
      strokeDashArray: 7,
      xaxis: { lines: { show: false } },
    },
    dataLabels: { enabled: false },
    colors: [currentTheme.value.primary], // Primary color for the line and dots
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
    xaxis: {
      categories: props.dates,
      tickPlacement: 'on',
      labels: {
        show: true,
        style: { colors: disabledColor, fontSize: '12px' },
        rotate: -45,
        rotateAlways: true,
        formatter: (value: string) => value, // Use date strings as-is
      },
      crosshairs: { opacity: 0 },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      labels: {
        style: {
          colors: disabledColor,
          fontSize: '12px',
        },
        formatter: (value: number) => khrFormatter.format(value),
      },
    },
  }
})

const moreList = [
  { title: 'Share', value: 'Share' },
  { title: 'Refresh', value: 'Refresh' },
  { title: 'Update', value: 'Update' },
]
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Monthly Token Analytics</VCardTitle>

      <template #append>
        <div class="me-n3">
          <MoreBtn :menu-list="moreList" />
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <VueApexCharts type="line" :options="options" :series="series" :height="200" />

      <div class="d-flex align-center mb-1 gap-x-4">
        <h4 class="text-h4">
          {{ percentageChange }}%
        </h4>
        <p class="mb-0">
          Your token usage is {{ percentageChange }}%
          <span class="text-high-emphasis">{{ isImproved ? '😎' : '😔' }}</span>
          {{ isImproved ? 'better' : 'lower' }} compared to the previous month
        </p>
      </div>

      <p class="mb-5">
        <strong>Days with Sales:</strong> <span class="text-success">{{ daysWithSales }}</span>,
        <strong>Average Weekly Earning:</strong> <span class="text-success">{{ khrFormatter.format(avgWeeklyEarning)
          }}</span>,
        <strong>Average Daily Earning:</strong> <span class="text-success">{{ khrFormatter.format(avgDailyEarning)
          }}</span>
      </p>

      <div class="d-flex gap-x-4 mb-4">
        <VSelect v-model="selectedYear" :items="years" label="Select Year" density="compact" style="width: 150px;" />
        <VSelect v-model="selectedMonth" :items="months" label="Select Month" density="compact"
          :disabled="!selectedYear" style="width: 150px;" />
      </div>
    </VCardText>
  </VCard>
</template>
