<template>
  <div class="nav">
    <div class="nav-container">
      <div class="nav-left">
        <h1 v-if="$route.path === '/'" class="nav-title">Dashboard</h1>
        <h1 v-if="$route.path === '/complaints'" class="nav-title">Complaints</h1>
        <h1 v-if="$route.path === '/documents'" class="nav-title">Documents</h1>
        <h1 v-if="$route.path === '/chat'" class="nav-title">Chat</h1>
      </div>
      <Dock :model="dockItems" :position="top" class="dock">
        <template #icon="{ item }">
          <NuxtLink :to="item.url" v-tooltip.top="item.label">
            <img :alt="item.label" :src="item.icon" style="width: 100%;" />
          </NuxtLink>
        </template>
      </Dock>
      <div
        class="nav-right"
        @mouseover="active = true"
        @mouseleave="active = false"
      >
        <div class="nav-profile">
          <Avatar
            :image="user.user_metadata.picture"
            class="avatar"
            size="medium"
            shape="circle"
            style="color: #06c"
          />
          <div class="name">{{ user.user_metadata.name }}</div>
          <i class="pi pi-angle-down" />
          <div class="profile-menu" v-if="active">
            <div class="profile-menu-header"></div>
            <Menu :model="items" v-if="items.label = 'Log out'" @click="logout" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import Avatar from "primevue/avatar";
import Menu from "primevue/menu";
import Sidebar from "~/components/Sidebar.vue";

const router = useRouter();

const items = ref([
  { label: "Profile", icon: "pi pi-user" },
  { label: "Log out", icon: "pi pi-sign-out" },
]);

const client = useSupabaseClient();
const user = useSupabaseUser();

const logout = async () => {
  await client.auth.signOut();

  router.push("/login");
};

const active = ref(false);

const dockItems = ref([
    {
        label: 'Home',
        icon: '/dashboard.svg',
        url: '/'
    },
    {
        label: 'Complaints',
        icon: '/complaints-img.svg',
        url: '/complaints',
    },
    {
        label: 'Documents',
        icon: 'documents-img.svg',
        url: '/documents',
    },
]);
</script>

<style scoped>
.nav {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  /* border-bottom: 1px solid rgba(0, 0, 0, 0.1); */
  position: relative;
  z-index: 999;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-inline: 4rem;
  padding-block: 2.5rem;
}

.nav-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1d1d1f;
  margin: 0;
}

.nav-profile {
  display: flex;
  align-items: center;
  padding: 0.4rem;
  border-radius: 12px;
  transition: background-color border 200ms ease-in-out;
  cursor: pointer;
  position: relative;

}
.nav-profile:hover {
  background: #f7f7f7;
}

.nav-profile .name {
  font-weight: 500;
  font-size: 16px;
  margin-right: 1rem;
  color: #334155;
}

.avatar {
  margin-right: 0.7rem;
  background: transparent;
  height: 37px;
  width: 37px;
  object-fit: cover;
}

.pi-angle-down {
  margin-right: 8px;
}

.profile-menu {
  position: absolute;
  top: 60px;
  z-index: 1;
}

.profile-menu-header {
  width: 100%;
  height: 40px;
  background: transparent;
  position: absolute;
  top: -30px;
}

.p-dock-list-container {
  background: red !important;
  display: flex;
  gap: 100px;
}
</style>
