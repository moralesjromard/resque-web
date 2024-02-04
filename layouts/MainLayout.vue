<template>
  <div class="main">
    <Sidebar />
    <div class="main-content">
      <Nav />
      <div style="overflow: auto; max-height: calc(100vh - 70px)">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import Nav from "~/components/Nav.vue";
import Sidebar from "~/components/Sidebar.vue";

const visible = ref(true);

const client = useSupabaseClient();
const user = useSupabaseUser();

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
</style>
