<template>
  <MainLayout>
    <div class="dashboard">
      <div class="card-container">
        <div class="card">
          <div class="card-content">
            <label class="card-label">Total Complaints</label>
            <span class="card-count">{{ complaintsCount }}</span>
          </div>
          <img src="/complaints-img.svg" alt="">
        </div>
        <div class="card">
          <div class="card-content">
            <label class="card-label">Total Documents</label>
            <span class="card-count">{{ documentCount }}</span>
          </div>
          <img src="/documents-img.svg" alt="">
        </div>
      </div>
      <div class="login-history">
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
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, watchEffect } from "vue";

import MainLayout from "~/layouts/MainLayout.vue";
import { useUserStore } from "~/stores/user";

const user = useSupabaseUser();
const userStorage = useUserStore();

const complaintsCount = ref(0);
const documentCount = ref(0);

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

    userStorage.isLoading = false;

  }, 300);
});
</script>

<style scoped>
.card-container {
  display: flex;
  gap: 2rem;
}

.dashboard {
  padding: 4rem;
  padding-top: 1rem;
}

.card {
  background: white;
  width: fit-content;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-direction: row-reverse;
  padding-right: 2.5rem;
  margin-bottom: 2rem;
  
}

.card-content {
  display: flex;
  flex-direction: column;
}

.card-label {
  font-size: 1.3rem;
  font-weight: bold;
  color: #334155;
  margin-bottom: 0.5rem;
}

.card-count {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1d1d1f;
  text-align: left;
}

.login-history {
  padding: 0rem;
  margin-top: 2rem;
}

.login-history-title {
  font-size: 1.5rem;
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
  font-weight: 600;
}

.login-history-date {
  margin: 0;
  color: gray;
  font-size: 14px;
  font-weight: 400;
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
