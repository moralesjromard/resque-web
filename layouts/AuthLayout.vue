<template>
  <div class="container">
    <slot />
    <footer class="footer">
      &copy; Copyright 2024, Resque.com, All rights reserved.
    </footer>
  </div>
</template>

<style>
  .container {
    height: 100vh;
  }

  .footer {
    padding: 1.5rem;
    font-size: 14px;
    color: #565656;
  }
</style>
