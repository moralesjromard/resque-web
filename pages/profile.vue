<template>
  <MainLayout>
    <section class="profile">

      <div class="profile-item">
        <div class="profile-item-left">
          <h1 class="profile-item-title">
            Basic details
          </h1>
        </div>
        <div class="profile-item-right">
          <div class="avatar-container">
            <Avatar
              :image="user.user_metadata.picture"
              class="avatar"
              size="large"
              shape="circle"
            />
          </div>
          <div class="profile-details-text-container">
            <div class="profile-details-label">
              Full name
            </div>
            <div class="profile-details-text">
              {{ user.user_metadata.name }}
            </div>
          </div>
          <div class="profile-details-text-container">
            <div class="profile-details-label">
              Email address
            </div>
            <div class="profile-details-text">
              {{ user.user_metadata.email }}
            </div>
          </div>
        </div>
      </div>

      <div class="profile-item">
        <div class="profile-item-left">
          <h1 class="profile-item-title">
            Change password
          </h1>
        </div>
        <div class="profile-item-right">
          <form @submit.prevent="updatePassword">
            <div class="profile-details-text-container" style="margin-bottom: 0.5rem;">
              <div class="profile-details-label">
                New password
              </div>
              <InputText
                type="password"
                placeholder="Your new password."
                class="form-input"
                v-model="newPassword"
              />
              <div class="error-text" v-if="errorMessage">
                {{ errorMessage }}
              </div>
            </div>
            <Button class="submit-btn" type="submit">Submit</Button>
          </form>
        </div>
      </div>

    </section>
  </MainLayout>
  <Toast position="top-center"  />
</template>

<script setup>
  import { ref } from 'vue';
  import Toast from 'primevue/toast';
  import { useToast } from "primevue/usetoast";

  import Avatar from "primevue/avatar";
  import Button from "primevue/button";

  import MainLayout from '~/layouts/MainLayout.vue';
  import { useUserStore } from "~/stores/user";

  

  const user = useSupabaseUser();
  const client = useSupabaseClient();
  const toast = useToast();

  const userStorage = useUserStore();

  let newPassword = ref('');
  let errorMessage = ref(null);

  const updatePassword = async () => {
    errorMessage.value = null;
    const { data, error } = await client.auth.updateUser({
      password: newPassword.value
    });

    if (error) {
      return errorMessage.value = error.message
    } 

    setTimeout(() => {
      toast.add({ 
        severity: 'success', 
        summary: 'Change password successfully', 
        detail: 'Your password has been changed.', 
        life: 5000 
      });
      currentPassword = '';
      newPassword.value = '';
      errorMessage.value = null;
    }, 300);
  }

  onBeforeMount(() => {
    userStorage.isLoading = true;
  });

  onMounted(() => {
    setTimeout(() => {
      userStorage.isLoading = false;
    }, 300);
  });
</script>

<style scoped>
  .profile {
    padding: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 4rem;
  }

  .profile-item {
    border-radius: 5px;
    padding: 3rem;
    box-shadow: rgba(0, 0, 0, 0.04) 0px 5px 22px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px;
    display: flex;
    width: 100%;
  }

  .profile-item-left {
    flex: 0.5;
  }

  .profile-item-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .profile-item-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0;
    color: #1d1d1f;
  }

  .avatar {
    width: 100px;
    height: 100px;
    padding: 0.3rem;
    border: 2px dashed rgba(0, 0, 0, 0.1);
  }

  .avatar-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
  }

  .change-profile-btn {
    height: fit-content;
    border-radius: 5px;
    background: transparent;
    border: none;
    color: #1d1d1f;
    font-size: 1rem;
    font-weight: 500;
    padding: 0.7rem;
    cursor: pointer;
  }

  .change-profile-btn:hover {
    background: #F1F1F1;
  }

  .profile-details-label {
    font-size: 1rem;
    font-weight: 500;
    color: gray;
  }
  .profile-details-text {
    font-size: 1rem;
    font-weight: 500;
    color: #1d1d1f;
  }

  .profile-delete-btn {
    background: transparent;
    color: rgb(243, 38, 38);
    border: 1px solid rgb(243, 38, 38);
    font-weight: 600;
    border-radius: 5px;
    transition: background-color 200ms ease-in-out;
    box-shadow: none;
  }

  .profile-delete-btn:hover {
    background: rgba(255, 0, 0, 0.081);
  }

  .form-input {
    width: 100%;
    margin-top: 1rem;
    height: 50px;
    background-color: #f7f7f7;
    border: none;
  }

  .submit-btn {
    margin-top: 1rem;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 5px;
  }

  .error-text {
    font-size: 14px;
    color: rgb(243, 38, 38);
    margin-top: 1rem;
  }

</style>