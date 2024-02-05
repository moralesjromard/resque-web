import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    isLoading: true,
  }),
  // persist: true,
});
