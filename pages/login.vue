<template>
  <AuthLayout>
    <div class="container">
      <header class="intro">
        <div class="logo">
          <img src="/resque.png" alt="Logo" class="logo-img">
          <div class="logo-text">resque<span class="logo-dot">.</span></div>
        </div>
        <div class="intro-text">Sign in to Resque</div>
      </header>
      <form class="form">
        <div class="form-group">
          <label class="form-label">Email</label>
          <InputGroup class="form-field">
            <InputText placeholder="Your email." class="form-input" />
          </InputGroup>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <InputGroup class="form-field">
            <InputText
              type="password"
              placeholder="Your password."
              class="form-input"
            />
          </InputGroup>
        </div>
        <div class="form-checkbox-container">
          <Checkbox v-model="isChecked" value="checked" />
          <label class="checkbox-label">Remember me</label>
        </div>
        <InputGroup class="form-field">
          <Button class="form-btn">Sign In</Button>
        </InputGroup>
        <div class="or">
          <div class="or-line"></div>
          <span>Or</span>
        </div>
        <div class="google-auth-btn-container" @click="login('google')">
          <div class="google-auth-btn">
            <img
              class="google-icon"
              src="/google_icon.webp"
              alt="Google Icon"
              width="35"
            />
            Sign in with Google
          </div>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup>
import InputGroup from "primevue/inputgroup";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";

import AuthLayout from "~/layouts/AuthLayout.vue";

let isChecked = ref(false);

const client = useSupabaseClient();
const user = useSupabaseUser();

watchEffect(() => {
  if (user.value) {
    return navigateTo("/");
  }
});

const login = async (prov) => {
  const { data, error } = await client.auth.signInWithOAuth({
    provider: prov,
  });
  if (error) {
    console.log(error);
  }
};
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

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  right: 10px;
  margin-block: 1rem;
}

.logo-img {
  width: 75px;
  height: 75px;
  object-fit: contain;
  margin: 0;
}

.logo-text {
  font-size: 2.2rem !important;
  font-weight: bold;
  color: #1d1d1f;
  /* margin: 2rem; */
  position: relative;
  text-transform: capitalize;
}

.logo-dot {
  color: #3b82f6;
  position: absolute;
  font-size: 3rem;
  bottom: 4px;
  right: -15px;
  display: none;
}

.container .intro .intro-text {
  font-size: 1.2rem;
  font-weight: 500;
  color: #334155;
}

.form {
  width: 450px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 1rem;
  font-weight: 600;
  color: #334155;
}

.form-field {
  height: 50px;
  width: 100%;
  /* background: #EFEFEF; */
  background-color: #f7f7f7;
  border-radius: 12px;
  box-shadow: 0 0 0px #0557db;
  transition: all 100ms ease-in-out;
}

.form-addon {
  padding-inline: 1rem;
}

.form-input {
  padding-inline: 1rem;
  background-color: transparent;
  border: none;
  outline: none;
  border-radius: 12px;
}

.form-btn {
  width: 100%;
  border-radius: 12px;
  font-weight: 600;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  /* outline: 2px solid blue; */

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

.google-auth-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  border-radius: 12px;
  transition: all 250ms ease;
  cursor: pointer;
  background-color: #f7f7f7;
  font-weight: 500;
  color: #334155;
  font-weight: 600;
}

.google-auth-btn:hover {
  background-color: #e8e8e8;
}

.or {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-block: 0rem;
}

.or span {
  background: white;
  padding-inline: 1rem;
  font-size: 16px;
  color: #778496;
  font-weight: 400;
  position: relative;
  z-index: 1;
}

.or-line {
  width: 100%;
  height: 1px;
  background: #cbd5e1;
  position: absolute;
  z-index: 1;
}

@media screen and (max-width: 475px) {
  .form {
    max-width: 100%;
  }
}
</style>
