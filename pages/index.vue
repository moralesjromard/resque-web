<template>
  <AuthLayout>
    <div class="container">
      <header class="intro">
        <div class="logo-text">resque<span class="logo-dot">.</span></div>
        <div class="intro-text">Sign in to Resque</div>
      </header>
      <form class="form">
        <div class="form-group">
          <label class="form-label">Email</label>
          <InputGroup class="form-field">
            <InputGroupAddon class="form-addon">
                <i class="pi pi-envelope form-icon"></i>
            </InputGroupAddon>
            <InputText placeholder="your@gmail.com" class="form-input" />
          </InputGroup>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <InputGroup class="form-field">
            <InputGroupAddon class="form-addon">
                <i class="pi pi-lock form-icon"></i>
            </InputGroupAddon>
            <InputText type="password" placeholder="your password" class="form-input" />
          </InputGroup>
        </div>
        <div class="form-checkbox-container">
          <Checkbox v-model="isChecked" value="checked" />
          <label class="checkbox-label">Remember me</label>
        </div>
        <InputGroup class="form-field">
          <Button label="Sign In" class="form-btn" />
        </InputGroup>
      </form>
      <div class="form-link-container">
        Don't have an account?
        <NuxtLink class="form-link" to="/sign-up">Sign up</NuxtLink>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';

import AuthLayout from '~/layouts/AuthLayout.vue';

let isChecked = ref(false);

</script>

<style scoped>
.container {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.intro {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.logo-text {
  font-size: 2.5rem !important;
  font-weight: bold;
  color: #1D1D1F;
  margin: 2rem;
  position: relative;
}

.logo-dot {
  color: #3b82f6; 
  position: absolute;
  font-size: 3rem;
  bottom: 4px;
  right: -15px;
}

.container .intro .intro-text {
  font-size: 1.2rem;
  font-weight: 500;
  color: #334155;
}

.form {
  width: 450px;
  padding: 2rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.form-label {
  font-size: 1rem;
  font-weight: 500;
  color: #334155;
}

.form-field {
  height: 50px;
  width: 100%;
}

.form-addon {
  padding-inline: 1rem;
}

.form-input {
  padding-inline: 1rem;
}

.form-btn {
  width: 100%;
  border-radius: 50px;
  font-weight: bold;
}

.form-checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.checkbox-label {
  color: #334155;
  font-weight: 500;
}

.form-link-container {
  color: #334155;
  padding-block: 1rem;
}

.form-link-container .form-link {
  font-weight: bold;
  transition: color 200ms ease-in-out;
  cursor: pointer;
  color: #1D1D1F;
  text-decoration: none;
}

.form-link-container .form-link:hover {
  color: #06c;
}

@media screen and (max-width: 475px) {
  .form {
    max-width: 100%;
  }
}
</style>