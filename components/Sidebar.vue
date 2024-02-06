<template>
  <div class="sidebar">
    <div class="logo">
      <img src="/resque.png" alt="Logo" class="logo-img">
      <div class="logo-text">resque</div>
    </div>
    <div class="sidebar-item-container">
      <div
        v-for="(item, index) in items"
        class="sidebar-item"
        :key="index"
        @click="item.command"
      >
        <i :class="item.icon" />
        <span class="sidebar-item-label">
          {{ item.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const items = ref([
  {
    icon: "pi pi-chart-bar",
    label: "Dashboard",
    command: () => {
      router.push("/");
    },
  },
  {
    icon: "pi pi-book",
    label: "Complaints",
    command: () => {
      router.push("/complaints");
    },
  },
  {
    icon: "pi pi-file",
    label: "Documents",
    command: () => {
      router.push("/documents");
    },
  },
]);
</script>

<style scoped>
.sidebar {
  min-width: 300px;
  padding: 1.5rem;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 1.5rem;
}

.logo {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  gap: 0.5rem;
}

.logo-img {
  width: 45px;
  height: 45px;
  object-fit: contain;
  margin: 0;
}

.logo-text {
  font-size: 1.8rem !important;
  font-weight: bold;
  color: #1d1d1f;
  /* margin: 2rem; */
  position: relative;
  text-transform: capitalize;
}

.sidebar-item-container {
  padding-block: 0.8rem;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 0.7rem;
  padding-inline: 0.9rem;
  gap: 1.5rem;
  border-radius: 5px;
  transition: background-color 250ms ease-in-out;
  cursor: pointer;
}

.sidebar-item:hover {
  background: #f7f7f7;
}

.sidebar-item-label {
  color: #334155;
  font-size: 1rem;
  font-weight: 500;
}

.pi {
  color: #334155;
}
</style>
