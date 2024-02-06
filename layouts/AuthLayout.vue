<template>
  <div class="container">
    <div class="container-left">
      <slot />
      <footer class="footer">
        &copy; Copyright 2024, Resque.com, All rights reserved.
      </footer>
    </div>
    <div class="container-right">
      <img
        src="/auth-image.png"
        alt="Auth image"
        class="auth-img"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: row !important;
}

.footer {
  padding: 1.5rem;
  font-size: 14px;
  color: #565656;
  text-align: center;
}

.container-left {
  display: flex;
  flex-direction: column;
  background: white;
  height: 100%;
}

.container-right {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f2f6fa;
  position: relative;
}

.auth-img {
  width: 100%; 
  height: 100%; 
  object-fit: contain;
}
</style>
