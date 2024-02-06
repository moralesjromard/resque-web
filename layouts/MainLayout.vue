<template>
  <div class="main">
    <!-- <Sidebar /> -->
    <div class="main-content">
      <ProgressBar
        v-if="userStorage.isLoading"
        mode="indeterminate" 
        class="progress-bar" 
      />
      <div class="main-sub">
        <Nav />
        <div style="margin-top: 2rem;">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import Nav from "~/components/Nav.vue";
import Sidebar from "~/components/Sidebar.vue";

import { useUserStore } from "~/stores/user";
import ProgressBar from "primevue/progressbar";
import Dock from 'primevue/dock';

const visible = ref(true);

const user = useSupabaseUser();
const userStorage = useUserStore();

onBeforeMount(() => {
  if (!user.value) {
    navigateTo("/login");
  }
});
</script>

<style scoped>
.main {
  height: 100vh;
  display: flex;       
}

.main-content {
  width: 100%;
  overflow: auto;
  position: relative;
}

.main-sub {
  min-width: 1500px;
}
.progress-bar {
  height: 4px; 
  width: 100%;
  position: absolute; 
  right: 0;
  top: 0; 
  z-index: 9999;
}



</style>
