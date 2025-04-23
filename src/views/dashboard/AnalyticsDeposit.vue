<script setup lang="ts">

// Define props at the top to avoid initialization errors
const props = defineProps<{
  loading: boolean;
  data: {
    id: number;
    fullName: string;
    app: string;
    email: string;
    device: string;
    avatar: string;
    timeStamp: string;
    token: string;
    msg: string;
  }[];
}>();

// Filter data to include only payments with Source: Server
const filteredData = computed(() => {
  return props.data
    .filter(item => item.msg.includes('\nSource: Server') || item.msg.includes('\n--> Source: Server 💻'))
    .map(item => ({
      ...item,
      usdAmount: extractUSDAmount(item.msg),
    }));
});

// Function to extract USD amount from msg
const extractUSDAmount = (msg: string): string => {
  const amountMatch = msg.match(/Amount: (\d+\.?\d*)\s*USD/);
  return amountMatch ? amountMatch[1] : '0';
};

// Define headers for the data table
const headers = [
  { title: 'User', key: 'username' },
  { title: 'Email', key: 'email' },
  { title: 'App', key: 'app' },
  { title: 'User Device', key: 'device' },
  { title: 'Amount (USD)', key: 'usdAmount' }, // Changed from Tokens to Amount (USD)
];

// Resolve role variant for icons and colors
const resolveUserRoleVariant = (app: string) => {
  const roleLowerCase = app.toLowerCase();
  if (roleLowerCase === 'ai voice changer')
    return { color: 'warning', icon: 'ri-mic-ai-fill' };
  if (roleLowerCase === 'chatbot')
    return { color: 'info', icon: 'ri-chat-voice-ai-fill' };
  if (roleLowerCase === 'get sub kh')
    return { color: 'success', icon: 'ri-ai-generate-text' };
  if (roleLowerCase === 'top up')
    return { color: 'primary', icon: 'ri-money-dollar-circle-line' };
  if (roleLowerCase === 'editor')
    return { color: 'warning', icon: 'ri-edit-box-line' };
  if (roleLowerCase === 'admin')
    return { color: 'primary', icon: 'ri-vip-crown-line' };
  return { color: 'success', icon: 'ri-pie-chart-line' };
};

// Resolve status variant for chip colors
const resolveUserStatusVariant = (stat: string) => {
  const statLowerCase = stat.toLowerCase();
  if (statLowerCase === 'pending') return 'warning';
  if (statLowerCase === 'active') return 'success';
  if (statLowerCase === 'inactive') return 'secondary';
  return 'primary';
};

// Format timestamp to display "X seconds/minutes/hours/days ago"
const formatTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp);
  date.setTime(date.getTime());
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
};
</script>

<template>
  <VCard>
    <VDataTable :headers="headers" :items="filteredData" :items-per-page="10" :loading="props.loading"
      :fixed-footer="true" item-value="id" class="text-no-wrap">
      <!-- User -->
      <template #item.username="{ item }">
        <div class="d-flex align-center gap-x-4 cursor-pointer" :title="item.msg">
          <img :src="item.avatar" width="34" height="34" style="border-radius: 50%; object-fit: cover;">
          <div class="d-flex flex-column">
            <h6 class="text-h6 font-weight-medium user-list-name">
              {{ item.fullName }}
            </h6>
            <span class="text-sm text-medium-emphasis">
              {{
                new Date(Date.parse(item.timeStamp)).toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'Asia/Phnom_Penh',
                })
              }}
              ({{ formatTimeAgo(item.timeStamp) }})
            </span>
          </div>
        </div>
      </template>
      <!-- Role -->
      <template #item.app="{ item }">
        <div class="d-flex gap-4">
          <VIcon :icon="resolveUserRoleVariant(item.app).icon" :color="resolveUserRoleVariant(item.app).color"
            size="22" />
          <div class="text-capitalize text-high-emphasis">
            {{ item.app }}
          </div>
        </div>
      </template>
      <!-- Status -->
      <template #item.status="{ item }">
        <VChip :color="resolveUserStatusVariant(item.device)" size="small" class="text-capitalize">
          {{ item.device }}
        </VChip>
      </template>
      <!-- USD Amount -->
      <template #item.usdAmount="{ item }">
        <div class="d-flex flex-column">
          <span class="text-sm text-success">
            + ${{ Number(item.usdAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            }}
          </span>
        </div>
      </template>
    </VDataTable>
  </VCard>
</template>
