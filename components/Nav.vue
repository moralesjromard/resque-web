<template>
  <div class="nav">
    <div class="nav-container">
      <div class="nav-left">
        <p v-if="$route.path === '/dashboard'" class="nav-title">Dashboard</p>
        <p v-if="$route.path === '/complaints'" class="nav-title">Complaints</p>
        <p v-if="$route.path === '/documents'" class="nav-title">Documents</p>
        <p v-if="$route.path === '/chat'" class="nav-title">Chat</p>
      </div>
      <div class="nav-right" @mouseover="active = true" @mouseleave="active = false">
        <div class="nav-profile">
          <Avatar image="https://picsum.photos/200/300" class="avatar" size="medium" shape="circle" style="color: #06c;" />
          <div class="name">
            Omar Morales
          </div>
          <i class="pi pi-angle-down" />
          <div class="profile-menu" v-if="active" >
              <div class="profile-menu-header"></div>
              <Menu :model="items" />
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import Avatar from 'primevue/avatar';
import Menu from 'primevue/menu';

const items = ref([
    { label: 'Profile', icon: 'pi pi-user' },
    { label: 'Log out', icon: 'pi pi-sign-out' }
]);

const active = ref(false);

</script>

<style scoped>

.nav {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 999;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-inline: 1rem;
  padding-left: 2rem;
}

.nav-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1D1D1F;
  margin: 0;
}

.nav-profile {
  display: flex;
  align-items: center;
  padding: 0.2rem;
  border-radius: 50px;
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
  top: 65px;
  z-index: 1;
}

.profile-menu-header {
  width: 100%;
  height: 40px;
  background: transparent;
  position: absolute;
  top: -30px;
}
</style>