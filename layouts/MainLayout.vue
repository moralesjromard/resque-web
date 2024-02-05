<template>
  <div class="main">
    <Sidebar />
    <div class="main-content">
      <Nav />
      <div
        style="
          overflow: auto;
          height: calc(100vh - 70px);
          position: relative;
        "
      >
      <ProgressBar
        v-if="userStorage.isLoading"
        mode="indeterminate" 
        style="height: 3px" 
      />
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import Nav from "~/components/Nav.vue";
import Sidebar from "~/components/Sidebar.vue";

import { useUserStore } from "~/stores/user";
import ProgressBar from "primevue/progressbar";

const visible = ref(true);

const client = useSupabaseClient();
const user = useSupabaseUser();
const userStorage = useUserStore();

onMounted(() => {
  if (!user.value) {
    navigateTo("/login");
  }
});
</script>

<style scoped>
body {
  overflow: hidden;
}

.main {
  height: 100vh;
  display: flex;
}

.main-content {
  width: 100%;
}

.loading-container {
  background: blue;
  height: 100%;
}
</style>
