<script setup lang="ts">
import getsubkh from '@images/logos/cc.jpg';
import chatbot from '@images/logos/chatbot.jpg';
import voice_changer from '@images/logos/voice_changer.png';
import { watch } from 'vue';

// Destructure props to make them available as variables
const {
  totals_earning,
  ai_voice_changer_earning,
  getsubkh_earning,
  chatbot_earning,
} = defineProps<{
  totals_earning: number
  ai_voice_changer_earning: number
  getsubkh_earning: number
  chatbot_earning: number
}>()

// Format earnings to currency-like string (e.g., $12,345.67)
const formatCurrency = (value: number): string => {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

// Calculate percentage safely (avoid division by zero)
const calculatePercentage = (earning: number, total: number): number => {
  if (total === 0) return 0
  const percentage = (earning / total) * 100
  return Math.min(Math.max(percentage, 0), 100) // Clamp between 0 and 100
}

// Earnings array with dynamic amounts and percentages
const earnings = [
  {
    avatar: voice_changer,
    title: 'Ai Voice Changer',
    subtitle: 'Python, Voice Cloning, Ai',
    amount: formatCurrency(ai_voice_changer_earning / 4000),
    progress: 'primary',
    percentage: calculatePercentage(ai_voice_changer_earning, totals_earning),
  },
  {
    avatar: chatbot,
    title: 'I-Chat Powered by Gemini',
    subtitle: 'Gemini Api, Chatbot',
    amount: formatCurrency(chatbot_earning / 4000),
    progress: 'info',
    percentage: calculatePercentage(chatbot_earning, totals_earning),
  },
  {
    avatar: getsubkh,
    title: 'Get Sub Kh',
    subtitle: 'Subtitle, Tiktok, Khmer',
    amount: formatCurrency(getsubkh_earning / 4000),
    progress: 'secondary',
    percentage: calculatePercentage(getsubkh_earning, totals_earning),
  },
]

// Watch for changes in totals_earning or individual earnings to update amounts and percentages
watch(
  () => [totals_earning, ai_voice_changer_earning, getsubkh_earning, chatbot_earning],
  () => {
    earnings[0].amount = formatCurrency(ai_voice_changer_earning / 4000)
    earnings[0].percentage = calculatePercentage(ai_voice_changer_earning, totals_earning)
    earnings[1].amount = formatCurrency(chatbot_earning / 4000)
    earnings[1].percentage = calculatePercentage(chatbot_earning, totals_earning)
    earnings[2].amount = formatCurrency(getsubkh_earning / 4000)
    earnings[2].percentage = calculatePercentage(getsubkh_earning, totals_earning)
  }
)

const moreList = [
  { title: 'Share', value: 'Share' },
  { title: 'Refresh', value: 'Refresh' },
  { title: 'Update', value: 'Update' },
]
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Total Earning</VCardTitle>

      <template #append>
        <div class="me-n3">
          <MoreBtn :menu-list="moreList" />
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <div class="d-flex align-center cursor-pointer"
        :title="`${totals_earning.toLocaleString('km-KH', { style: 'currency', currency: 'KHR' })}`">
        <h3 class="text-h3">
          ${{ (Number(totals_earning) / 4000).toFixed(2) }}
        </h3>
        <VIcon size="24" icon="ri-arrow-up-s-line" color="success" />
      </div>
      <div class="text-body-1 mb-12">
        Actual Money & Free User Tokens Total Earning
      </div>

      <VList class="card-list">
        <VListItem v-for="earning in earnings" :key="earning.title">
          <template #prepend>
            <VAvatar rounded :image="earning.avatar" variant="tonal" />
          </template>

          <VListItemTitle class="font-weight-medium">
            {{ earning.title }}
          </VListItemTitle>
          <VListItemSubtitle class="text-body-1">
            {{ earning.subtitle }}
          </VListItemSubtitle>

          <template #append>
            <div class="cursor-pointer"
              :title="`${Number(earning.amount.replace(/[^\d.-]/g, '')) * 4000}.00 KHR\n${earning.percentage.toFixed(2)} %`">
              <h6 class="text-h6 mb-2">
                {{ earning.amount }}
              </h6>
              <VProgressLinear :color="earning.progress" :model-value="earning.percentage" rounded-bar rounded />
            </div>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1.5rem;
}
</style>
