<script setup lang="ts">
import AnalyticsTotalEarning from '@/views/dashboard/AnalyticsTotalEarning.vue';
import AnalyticsUserTable from '@/views/dashboard/AnalyticsUserTable.vue';
import AnalyticsWeeklyOverview from '@/views/dashboard/AnalyticsWeeklyOverview.vue';
import avatar1 from '@images/avatars/avatar-1.png';
import { onMounted, ref, computed } from 'vue';

const totalProfit = {
  title: 'Total Profit',
  color: 'secondary',
  icon: 'ri-pie-chart-2-line',
  stats: '$25.6k',
  change: 42,
  subtitle: 'Weekly Project',
};

const newProject = {
  title: 'New Project',
  color: 'primary',
  icon: 'ri-file-word-2-line',
  stats: '862',
  change: -18,
  subtitle: 'Yearly Project',
};

// Reactive userData array to store fetched data
const userData = ref<
  {
    id: number;
    fullName: string;
    app: string;
    email: string;
    device: string;
    avatar: string;
    timeStamp: string;
    token: string;
    msg: string;
  }[]
>([]);

const error = ref<string | null>(null);
const loading = ref<boolean>(true);
const totals_earning = ref(0);
const ai_voice_changer_earning = ref(0);
const getsubkh_earning = ref(0);
const chatbot_earning = ref(0);

// Selected month (default to current month)
const selectedMonth = ref(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`)

// Method to hash a string using SHA-256
const sha256 = async (str: string): Promise<string> => {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
};

// Generate API key matching the Python logic
const generateApiKey = async (): Promise<string> => {
  const date = new Date();
  const dateStr =
    date.getUTCFullYear() +
    '-' +
    String(date.getUTCMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getUTCDate()).padStart(2, '0') +
    'T' +
    String(date.getUTCHours()).padStart(2, '0') +
    ':' +
    String(date.getUTCMinutes()).padStart(2, '0');
  const password = 'admin2357.!';
  const raw = `${dateStr}${password}`;
  return await sha256(raw);
};

// Function to parse the text field and extract user data
const parseUserData = (message: any) => {
  const text = message.text;
  const fullNameMatch = text.match(/User(?:name)?: (.+?)\n/);
  const avatarMatch = text.match(/User Profile: (.+?)\n/);
  const appMatch = text.match(/App ID: (.+?)\n/);
  const deviceMatch = text.match(/User Device Type: (.+?)$/m);
  const tokenMatch = text.match(/Paid Tokens: (.+?)\n/);
  const email = text.match(/Email: (.+?)\n/);

  return {
    id: message.message_id,
    fullName: fullNameMatch ? fullNameMatch[1] : 'Unknown',
    app: appMatch ? appMatch[1] : 'Unknown',
    email: email ? email[1] : 'No Record',
    device: deviceMatch ? deviceMatch[1] : 'Unknown',
    avatar: avatarMatch ? avatarMatch[1] : avatar1,
    timeStamp: message.timestamp,
    token: tokenMatch ? tokenMatch[1] : '0',
    msg: text,
  };
};

// Compute token data for the selected month and additional metrics
const dailyTokenData = computed(() => {
  // Parse selected month (e.g., "2025-04")
  const [year, month] = selectedMonth.value.split('-').map(Number);
  const startDate = new Date(year, month - 1, 1); // First day of the month
  const endDate = new Date(year, month, 0); // Last day of the month
  const numDays = endDate.getDate(); // Number of days in the month

  // Initialize arrays for tokens and dates
  const tokensByDay = Array(numDays).fill(0);
  const dates = Array(numDays).fill('');

  // Generate date labels (e.g., "Apr 1", "Apr 2", ...)
  for (let i = 0; i < numDays; i++) {
    const date = new Date(year, month - 1, i + 1);
    dates[i] = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // Calculate total tokens for the selected month
  let currentMonthTotal = 0;
  userData.value.forEach(item => {
    const itemDate = new Date(item.timeStamp);
    itemDate.setHours(0, 0, 0, 0); // Normalize to start of day

    // Check if the item is within the selected month
    if (
      itemDate.getFullYear() === year &&
      itemDate.getMonth() === month - 1
    ) {
      const dayIndex = itemDate.getDate() - 1; // 0-based index for the day
      const tokenValue = parseFloat(item.token);
      if (!isNaN(tokenValue)) {
        tokensByDay[dayIndex] += tokenValue;
        currentMonthTotal += tokenValue;
      }
    }
  });

  // Calculate total tokens for the previous month
  const prevMonthDate = new Date(year, month - 2, 1); // First day of previous month
  const prevMonthYear = prevMonthDate.getFullYear();
  const prevMonthMonth = prevMonthDate.getMonth();
  let prevMonthTotal = 0;
  userData.value.forEach(item => {
    const itemDate = new Date(item.timeStamp);
    itemDate.setHours(0, 0, 0, 0); // Normalize to start of day

    if (
      itemDate.getFullYear() === prevMonthYear &&
      itemDate.getMonth() === prevMonthMonth
    ) {
      const tokenValue = parseFloat(item.token);
      if (!isNaN(tokenValue)) {
        prevMonthTotal += tokenValue;
      }
    }
  });

  // Calculate percentage change
  let percentageChange = 0;
  let isImproved = false;
  if (prevMonthTotal === 0) {
    percentageChange = currentMonthTotal > 0 ? 100 : 0; // If previous month is 0, treat any usage as 100% increase
    isImproved = currentMonthTotal > 0;
  } else {
    percentageChange = ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100;
    isImproved = percentageChange > 0;
  }

  // Calculate additional metrics
  const daysWithSales = tokensByDay.filter(tokens => tokens > 0).length;
  const avgWeeklyEarning = numDays > 0 ? currentMonthTotal / (numDays / 7) : 0; // Average over weeks
  const avgDailyEarning = numDays > 0 ? currentMonthTotal / numDays : 0; // Average per day

  return {
    tokens: tokensByDay,
    dates,
    percentageChange: Math.abs(percentageChange).toFixed(0), // Absolute value for display
    isImproved,
    daysWithSales,
    avgWeeklyEarning,
    avgDailyEarning,
  };
});

// Fetch data with the generated API key and update userData
const fetchData = async () => {
  try {
    const apiKey = await generateApiKey();
    const response = await fetch('https://ikhode_telegram_bot.tinh25.com/data.json', {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();
    // Filter to include only items with "App ID" in the message text
    const filteredData = jsonData.filter((item: any) => item.text?.includes('App ID'));

    userData.value = filteredData
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .map((item: any, index: number) => ({
        ...parseUserData(item),
        id: item.message_id || index + 1,
      }));

    // Sum all Paid Tokens for totals_earning
    totals_earning.value = userData.value.reduce((sum, item) => {
      const tokenValue = parseFloat(item.token);
      return sum + (isNaN(tokenValue) ? 0 : tokenValue);
    }, 0);

    // Calculate earnings for each app
    ai_voice_changer_earning.value = userData.value
      .filter(item => item.app === 'Ai Voice Changer')
      .reduce((sum, item) => {
        const tokenValue = parseFloat(item.token);
        return sum + (isNaN(tokenValue) ? 0 : tokenValue);
      }, 0);

    getsubkh_earning.value = userData.value
      .filter(item => item.app === 'Get Sub Kh')
      .reduce((sum, item) => {
        const tokenValue = parseFloat(item.token);
        return sum + (isNaN(tokenValue) ? 0 : tokenValue);
      }, 0);

    chatbot_earning.value = userData.value
      .filter(item => item.app === 'Chatbot')
      .reduce((sum, item) => {
        const tokenValue = parseFloat(item.token);
        return sum + (isNaN(tokenValue) ? 0 : tokenValue);
      }, 0);

  } catch (err) {
    console.error('Error fetching CBDC data:', err);
    error.value = err instanceof Error ? err.message : 'Unknown error';
  } finally {
    loading.value = false;
  }
};

// Call fetchData when the component is mounted
onMounted(fetchData);
</script>

<template>
  <VRow class="match-height">
    <VCol cols="12" md="4">
      <AnalyticsTotalEarning :totals_earning="totals_earning" :ai_voice_changer_earning="ai_voice_changer_earning"
        :getsubkh_earning="getsubkh_earning" :chatbot_earning="chatbot_earning" />
    </VCol>

    <VCol cols="12" md="8">
      <AnalyticsWeeklyOverview :dailyTokens="dailyTokenData.tokens" :dates="dailyTokenData.dates"
        :percentageChange="dailyTokenData.percentageChange" :isImproved="dailyTokenData.isImproved"
        :daysWithSales="dailyTokenData.daysWithSales" :avgWeeklyEarning="dailyTokenData.avgWeeklyEarning"
        :avgDailyEarning="dailyTokenData.avgDailyEarning" @update:month="selectedMonth = $event" />
    </VCol>

    <VCol cols="12">
      <AnalyticsUserTable :loading="loading" :data="userData" />
    </VCol>
  </VRow>
</template>
