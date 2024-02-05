<template>
  <MainLayout>
    <div style="padding: 2rem" class="main">
      <div class="card-container">
        <div class="card">
          <div class="card-content">
            <label class="card-label">Total Complaints</label>
            <span class="card-count">{{ complaintsCount }}</span>
          </div>
          <div class="card-icon">
            <i class="pi pi-book" />
          </div>
        </div>
        <div class="card">
          <div class="card-content">
            <label class="card-label">Total Documents</label>
            <span class="card-count">{{ documentCount }}</span>
          </div>
          <div class="card-icon card-icon-document">
            <i class="pi pi-file" />
          </div>
        </div>
      </div>
      <div class="skeleton-container" v-if="userStorage.isLoading">
        <div class="skeleton-bar-chart">
          <Skeleton borderRadius="16px" width="56px" height="75px"></Skeleton>
          <Skeleton borderRadius="16px" width="56px" height="300px"></Skeleton>
          <Skeleton borderRadius="16px" width="56px" height="250px"></Skeleton>
          <Skeleton borderRadius="16px" width="56px" height="100px"></Skeleton>
          <Skeleton borderRadius="16px" width="56px" height="150px"></Skeleton>
          <Skeleton borderRadius="16px" width="56px" height="200px"></Skeleton>
          <Skeleton borderRadius="16px" width="56px" height="300px"></Skeleton>
          <Skeleton borderRadius="16px" width="56px" height="90px"></Skeleton>
        </div>

        <div class="skeleton-doughnut-chart">
          <Skeleton shape="circle" width="250px" height="250px" class="skeleton-content"></Skeleton>
        </div>
      </div>
      <div class="chart-container" v-else>
        <div class="bard-chart-container">
          <Chart
            type="bar"
            :data="barChartData"
            :options="barChartOptions"
            class="bar-chart"
          />
        </div>
        <div class="doughnut-chart-container">
          <Chart
            type="doughnut"
            :data="doughnutChartData"
            :options="doughnutOptions"
            class="doughnut-chart"
          />
        </div>
      </div>
    </div>
    <!-- <div class="login-history">
      <p class="login-history-title">Login history</p>
      <div class="login-history-item">
        <p class="login-history-description-intro">Your last login was:</p>
        <p class="login-history-date">Feb 02 2024 at 11:38:21 AM (GMT +8)</p>
      </div>
      <div class="login-history-item">
        <p class="login-history-description-intro">
          Your last failed login was:
        </p>
        <p class="login-history-date">March 01 2024 at 5:38:21 PM (GMT +8)</p>
      </div>
    </div> -->
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, watchEffect } from "vue";

import MainLayout from "~/layouts/MainLayout.vue";
import Chart from "primevue/chart";
import { useUserStore } from "~/stores/user";
import Skeleton from "primevue/skeleton";

const user = useSupabaseUser();
const userStorage = useUserStore();

const complaintsCount = ref(0);
const documentCount = ref(0);

const barChartData = ref();
const barChartOptions = ref();

const doughnutChartData = ref();
const doughnutOptions = ref();

const setBarChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: ["February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Complaints dataset",
        backgroundColor: documentStyle.getPropertyValue("--cyan-500"),
        borderColor: documentStyle.getPropertyValue("--cyan-500"),
        data: [complaintsCount.value, 0, 0, 0, 0,],
      },
      {
        label: "Documents dataset",
        backgroundColor: documentStyle.getPropertyValue("--gray-500"),
        borderColor: documentStyle.getPropertyValue("--gray-500"),
        data: [documentCount.value, 0, 0, 0, 0],
      },
    ],
  };
};

const setBarChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--text-color");
  const textColorSecondary = documentStyle.getPropertyValue(
    "--text-color-secondary"
  );
  const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
          font: {
            weight: 500,
          },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false,
        },
      },
    },
  };
};

const setDoughnutChartData = () => {
  const documentStyle = getComputedStyle(document.body);

  return {
    labels: ["Total complaints", "Total Documents"],
    datasets: [
      {
        data: [complaintsCount.value, documentCount.value],
        backgroundColor: [
          documentStyle.getPropertyValue("--cyan-500"),
          documentStyle.getPropertyValue("--orange-500"),
          documentStyle.getPropertyValue("--gray-500"),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue("--cyan-400"),
          documentStyle.getPropertyValue("--orange-400"),
          documentStyle.getPropertyValue("--gray-400"),
        ],
      },
    ],
  };
};

const setDoughnutChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--text-color");

  return {
    plugins: {
      legend: {
        labels: {
          cutout: "60%",
          color: textColor,
        },
      },
    },
  };
};

const handleGetComplaintsCount = async () => {
  const res = await $fetch(
    `/api/prisma/get-user-complaints-count/${user.value.id}`
  );
  try {
    if (res) {
      complaintsCount.value = res;
    }
  } catch (err) {
    console.log(err);
  }
};

const handleGetDocumentRequestCount = async () => {
  const res = await $fetch(
    `/api/prisma/get-user-documents-count/${user.value.id}`
  );
  try {
    if (res) {
      documentCount.value = res;
    }
  } catch (err) {
    console.log(err);
  }
};

onBeforeMount(() => {
  userStorage.isLoading = true;
});

onMounted(() => {
  setTimeout(async () => {
    await handleGetComplaintsCount();
    await handleGetDocumentRequestCount();

    barChartData.value = setBarChartData();
    barChartOptions.value = setBarChartOptions();

    doughnutChartData.value = setDoughnutChartData();
    doughnutOptions.value = setDoughnutChartOptions();

    userStorage.isLoading = false;

  }, 300);
});
</script>

<style scoped>
.card-container {
  display: flex;
  gap: 2rem;
}

.card {
  background: white;
  width: fit-content;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-direction: row-reverse;
  padding-right: 2.5rem;
}

.card-content {
  display: flex;
  flex-direction: column;
}

.card-label {
  font-size: 1.3rem;
  font-weight: 400;
  color: #334155;
  margin-bottom: 0.5rem;
}

.card-count {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1d1d1f;
  text-align: center;
}

.card-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #06c;
  width: 70px;
  height: 70px;
  border-radius: 50px;
  background: url("/complaint-color2.jpg");
}

.card-icon-document {
  background: url("/documentrequest-color.jpg");
}

.card-icon i {
  font-size: 2rem;
  color: #fff;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  width: fit-content;
  gap: 4rem;
}

.bar-chart {
  width: 600px;
  height: 300px;
}

.doughnut-chart {
  width: 300px;
  height: 300px;
}

.login-history {
  padding: 2rem;
}

.login-history-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #1d1d1f;
  margin: 0;
}

.login-history-item {
  display: flex;
  flex-direction: column;
  margin: 0;
  margin-top: 1rem;
  gap: 0.3rem;
}

.login-history-description-intro {
  margin: 0;
  color: #1d1d1f;
  font-weight: 500;
}

.login-history-date {
  margin: 0;
  color: #565656;
  font-size: 14px;
  font-weight: 500;
}

.skeleton-container {
  display: flex;
  margin-top: 2rem;
  flex-direction: row;
  gap: 4rem;
}

.skeleton-container .skeleton-bar-chart {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 1.5rem;
}

.skeleton-bar-chart {
  display: flex;
}

.skeleton-doughnut-chart {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
