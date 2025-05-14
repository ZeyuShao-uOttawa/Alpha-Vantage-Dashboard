<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getDailyTimeSeries } from '../services/alphaVantage'
import { useResCols, useResChart } from '../composables/useResponsive'

const symbol = ref('AAPL');
const loading = ref(false);
const error = ref<string | null>(null);
const tableData = ref<any[]>([]);
const candleData = ref<any[]>([]);
const lineData = ref<any[]>([]);
const barData = ref<any[]>([]);
const pieData = ref<any[]>([]);
const cols = useResCols();
// const chartWidth = useResChart();

const candleOptions = ref({
  chart: {
    type: 'candlestick',
    height: 350,
  },
  title: {
    text: 'Daily Stock Prices',
    align: 'left',
  },
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    tooltip: {
      enabled: true,
    },
  },
});

const lineOptions = ref({
  chart: {
    type: 'line',
    height: 350,
  },
  title: {
    text: 'Daily Stock Prices',
    align: 'left',
  },
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    tooltip: {
      enabled: true,
    },
  },
});

const barOptions = ref({
  chart: {
    type: 'bar',
    height: 350,
  },
  dataLabels: {
    enabled: false
  },
  title: {
    text: 'Daily Trade Volume',
    align: 'left',
  },
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    tooltip: {
      enabled: true,
    },
  },
});

const pieOptions = ref({
  chart: {
    type: 'pie',
    height: 350,
  },
  labels: ['Initial'],
  title: {
    text: 'Stock Volume Split Past 5 Days',
    align: 'left',
  },
  tooltip: {
    y: {
      formatter: (val: any) => `${val} Shares`
    }
  }
});

const tableColumns = [
  { title: 'Date', key: 'date', sorter: 'default' },
  { title: 'Open', key: 'open', sorter: 'default' },
  { title: 'High', key: 'high', sorter: 'default' },
  { title: 'Low', key: 'low', sorter: 'default' },
  { title: 'Close', key: 'close', sorter: 'default' },
  { title: 'Volume', key: 'volume', sorter: 'default' },
]

const fetchData = async () => {
  try {
    loading.value = true;
    const data = await getDailyTimeSeries(symbol.value);
  
    tableData.value = parseTableData(data);
    candleData.value = [{data: parseCandleData(data)}];
    lineData.value = [{data: parseLineData(data)}];
    barData.value = [{data: parseBarData(data)}];

    const tempPieData = parsePieData(data);
    const pieLabels = tempPieData.map((entry) => entry.name);
    pieData.value = tempPieData.map((entry) => entry.value);
    pieOptions.value = {
      ...pieOptions.value,
      labels: pieLabels
    }
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
}

const parseTableData = (data: any) => {;
  const series = data['Time Series (Daily)'];

  return Object.entries(series).map(([date, values]: [string, any]) => ({
    date,
    open: parseFloat(values['1. open']),
    high: parseFloat(values['2. high']),
    low: parseFloat(values['3. low']),
    close: parseFloat(values['4. close']),
    volume: parseInt(values['5. volume']),
  }));
}

const parseCandleData = (data: any) => {
  const series = data['Time Series (Daily)'];

  return Object.entries(series).map(([date, values]: [string, any]) => ({
    x: new Date(date),
    y: [
      parseFloat(values['1. open']),
      parseFloat(values['2. high']),
      parseFloat(values['3. low']),
      parseFloat(values['4. close']),
    ]
  }));
}

const parseLineData = (data: any) => {
  const series = data['Time Series (Daily)'];

  return Object.entries(series).map(([date, values]: [string, any]) => ({
    x: new Date(date),
    y: [
      parseFloat(values['4. close']),
    ]
  }));
}

const parseBarData = (data: any) => {
  const series = data['Time Series (Daily)'];

  return Object.entries(series).map(([date, values]: [string, any]) => ({
    x: new Date(date),
    y: [
      parseInt(values['5. volume']),
    ]
  }));
}

const parsePieData = (data: any) => {
  const series = data['Time Series (Daily)'];
  const entries = Object.entries(series).slice(0,5);

  return entries.map(([date, values]: [string, any]) => ({
    name: date,
    value: parseInt(values['5. volume']),
  }));
}

onMounted(() => {
  fetchData()
});
</script>

<template>
  <n-flex justify="center" id="dashboard">
    <n-flex vertical>
      <n-flex>
        <h2>Stock Data for {{symbol}}</h2>
      </n-flex>
      <n-flex>
        <n-input
          v-model:value="symbol"
          placeholder="Search Stock Symbol"
          clearable
        />
        <n-button @click="fetchData">Fetch</n-button>
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">{{error}}</div>
      </n-flex>
    </n-flex>
    
    <n-grid x-gap="20" y-gap="20" :cols="cols">
      <n-grid-item>
        <apexchart
          type="candlestick"
          :options="candleOptions"
          :series="candleData"
          class="center"
          width="500"
        />
      </n-grid-item>
      <n-grid-item>
        <apexchart
          type="line"
          :options="lineOptions"
          :series="lineData"
          class="center"
          width="500"
        />
      </n-grid-item>
      <n-grid-item>
        <apexchart
          type="bar"
          :options="barOptions"
          :series="barData"
          class="center"
          width="500"
        />
      </n-grid-item>
      <n-grid-item>
        <apexchart
          type="pie"
          :options="pieOptions"
          :series="pieData"
          class="center"
          width="500"
        />
      </n-grid-item>
      
    </n-grid>
    <n-flex vertical>
      <n-data-table
        :columns="tableColumns"
        :data="tableData"
        :loading="loading"
        :pagination="{ pageSize: 10 }"
        class="data-table"
      />
    </n-flex>
  </n-flex>
</template>

<style scoped>
.center {
  display: flex;
  justify-content: center;
}

.data-table {
  width: 75vw;
}

#dashboard {
  margin-bottom: 5vh;
}
</style>
