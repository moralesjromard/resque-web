<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script>
import "primeicons/primeicons.css";
</script>

<style>
@import url("http://fonts.cdnfonts.com/css/sf-pro-display");
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

* {
  box-sizing: border-box;
  /* font-family: "SF Pro Display", "Inter", "Roboto", sans-serif; */
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Style scrollbar */
::-webkit-scrollbar-thumb {
  background-color: #959595;
  border: 4px solid transparent;
  border-radius: 8px;
  background-clip: padding-box;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #616161;
}

::-webkit-scrollbar-track {
  background: hsla(0, 0%, 100%, 0.8);
}

::-webkit-scrollbar {
  width: 16px;
}

body {
  margin: 0;
  overflow: hidden;
}

/* for primevue pagination */
.p-paginator {
  padding-inline: 4rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.p-dropdown {
  border-radius: 5px;
}
/* for primevue pagination */

.p-dialog-header-icons {
  display: none;
}

.p-menu {
  border-radius: 5px !important;
}

.p-datatable-emptymessage td {
  border: none !important; 
}

.p-toast-message {
  border-radius: 5px !important;
}

.p-confirm-dialog-reject {
  border: none;
}

.p-confirm-dialog-reject:hover {
  background: #F1F1F1;
}

</style>
