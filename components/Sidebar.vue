<template>
  <div class="sidebar">
    <div class="logo-text">resque<span class="logo-dot">.</span></div>
    <div class="sidebar-item-container">
      <div v-for="(item, index) in items" class="sidebar-item" :key="index" @click="item.command">
        <i :class="item.icon" />
        <span class="sidebar-item-label">
          {{ item.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const items = ref([
  {
    icon: 'pi pi-chart-bar', 
    label: 'Dashboard', 
    command: () => {
      router.push('/dashboard');
    }
  },
  {
    icon: 'pi pi-book', 
    label: 'Complaints', 
    command: () => {
      router.push('/complaints');
    }
  },
  {
    icon: 'pi pi-file', 
    label: 'Documents', 
    command: () =>{
      router.push('/documents');
    }
  },
  {
    icon: 'pi pi-comments', 
    label: 'Chat', 
    command: () => {
      router.push('/chat');
    }
  },
]);
</script>

<style scoped>
.sidebar {
  width: 300px;
  padding: 1rem;
  border-right: 1px solid rgba(0,0,0,0.1);
}

.logo-text {
  font-size: 2rem !important;
  font-weight: bold;
  color: #1D1D1F;
  margin: 0;
  padding-inline: 0.5rem;
  position: relative;
}

.logo-dot {
  color: #3b82f6; 
  position: absolute;
  font-size: 3rem;
  bottom: 0;
  transform: translateX(2px);
}

.sidebar-item-container {
  padding-block: 2rem;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 0.7rem;
  gap: 0.7rem;
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