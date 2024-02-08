<template>
  <MainLayout>
    <div class="complaints">
      <div class="data-table-container">
        <DataTable
          v-if="complaints"
          v-model:selection="selectedItem"
          :value="filteredData"
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          size="large"
          paginator
          removableSort
          :metaKeySelection="metaKey"
          dataKey="id"
          selectionMode="single"
          class="data-table"
          :globalFilter="globalFilter"
          scrollable
          columnResizeMode="fit"
          paginatorPosition="top"
        >
          <template #paginatorstart>
            <div class="add-btn-container">
              <Button class="add-btn" @click="isDialogVisible = true" type="button">
                <i class="pi pi-plus"></i>
                Add
              </Button>
            </div>
          </template>
          <template #paginatorend>
            <div class="search-container">
              <i class="pi pi-search" />
              <InputText
                v-model="globalFilter"
                placeholder="Keyword search."
                class="search-input"
              />
            </div>
          </template>
          <Column
            style="padding-inline: 4rem"
            field="id"
            header="Id"
            sortable
          ></Column>
          <Column field="respondentName" header="Respondent" sortable></Column>
          <Column field="crimeType" header="Crime type"></Column>
          <Column field="crimeOverview" header="Crime overview" style="max-width: 500px; height: auto;">
          </Column>
          <Column header="Status">
            <template #body="slotProps">
              <div class="status-type">
                {{ slotProps.data.status }}
              </div>
            </template>
          </Column>
          <Column
            field="createdAt"
            header="Created at"
            sortable
          >
            <template #body="slotProps">
              <div>
                {{ dayjs(slotProps.data.createdAt).format('MMMM D, YYYY, h:mm A') }}
              </div>
            </template>
          </Column>
          <template #empty>
            <div class="empty-data-container">
              <img src="/no-data-found.png" alt="No data" class="empty-img">
              <div class="empty-text">No data found</div>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </MainLayout>

  <Dialog
    v-model:visible="isDialogVisible"
    modal
    header="Add Complaint"
    style="width: 490px; padding: 0.5rem; border-radius: 15px; background: #FFF;"
  >
    <template #header>
      <!-- <i class="pi pi-plus dialog-filecomplaint-icon"></i> -->
      <span class="dialog-header-text">File a complaint</span>
    </template>
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label class="form-label">Respondent</label>
        <InputGroup class="field-group">
          <InputText
            placeholder="Enter respondent"
            class="form-input"
            v-model="respondent"
            required
          />
        </InputGroup>
      </div>
      <div class="form-group">
        <label class="form-label">Crime type</label>
        <Dropdown
          v-model="crimeType"
          :options="crimeTypes"
          optionLabel="name"
          placeholder="Select crime type"
          class="dropdown"
          aria-required="true"
        />
      </div>
      <div class="form-group">
        <label class="form-label">Crime overview</label>
        <Textarea
          rows="4"
          cols="40"
          style="max-height: 100px; border-radius: 7px"
          placeholder="Tell us what happened."
          v-model="crimeOverview"
          autoResize
          class="form-text-input"
          required
        />
      </div>
      <div class="dialog-btn-container">
        <Button 
          type="button" 
          class="dialog-btn cancel-btn" 
          @click="() => {
            isDialogVisible = false;
            respondent = null
            crimeType = null
            crimeOverview = null
          }"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          class="dialog-btn" 
        >
          Submit
        </Button>
      </div>
    </form>
  </Dialog>
  <Toast position="top-center"  />
</template>

<script setup>
import { ref, computed } from "vue";
import { useDayjs } from '#dayjs'

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

import { useUserStore } from "~/stores/user";
import MainLayout from "~/layouts/MainLayout.vue";

const user = useSupabaseUser();
const userStorage = useUserStore();
const toast = useToast();
const dayjs = useDayjs();

const complaints = ref([]);
const selectedItem = ref();
const metaKey = ref(true);
const globalFilter = ref("");
const isDialogVisible = ref(false);

const respondent = ref(null);
const crimeType = ref(null);
const crimeOverview = ref(null);

const crimeTypes = ref([
  { name: "Blotter" },
  { name: "Criminal Case" },
  { name: "Civil Case" },
]);

const filteredData = computed(() => {
  const filterText = globalFilter.value.toLowerCase();

  return complaints?.value.filter(
    (item) =>
      item.id.toString().includes(filterText) ||
      item.status.toLowerCase().includes(filterText) ||
      item.crimeType.toLowerCase().includes(filterText) ||
      item.crimeOverview.toLowerCase().includes(filterText) ||
      item.respondentName.toLowerCase().includes(filterText)
  );
});

const getComplaints = async () => {
  const res = await $fetch(
    `/api/prisma/get-all-complaints-by-user/${user.value.id}`
  );

  try {
    if (res) {
      complaints.value = res;
    }
  } catch (err) {
    console.log(err);
  }
};

const onSubmit = async () => {
  if (respondent.value && crimeType.value && crimeOverview.value) {
    const payload = {
      userId: user.value.id,
      respondent: respondent.value,
      crimeType: crimeType.value.name,
      crimeOverview: crimeOverview.value,
    };

    const res = await useFetch(`/api/prisma/add-complaint/`, {
      method: "POST",
      body: payload,
    });

    try {
      if (res) {
        respondent.value = "";
        crimeType.value = "";
        crimeOverview.value = "";
        getComplaints();
        setTimeout(() => {
          isDialogVisible.value = false;
          toast.add({ 
            severity: 'success', 
            summary: 'Complaint submitted successfully', 
            detail: 'We will review your complaint and respond within 24 hours.', 
            life: 5000 
          });
        }, 200)
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error: All Fields Required',
      detail: 'Please ensure that all fields are filled out before submitting.',
      life: 5000,
    });
  }
};

onBeforeMount(() => {
  userStorage.isLoading = true;
});

onMounted(() => {
  setTimeout(async () => {
    await getComplaints();
    userStorage.isLoading = false;
  }, 300);
});
</script>

<style scoped>

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.data-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-btn {
  display: flex;
  gap: 0.5rem;
  border-radius: 15px;
  text-transform: capitalize;
  font-weight: 600;
  height: 45px;
  margin-right: 9rem;
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  border: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
  border-radius: 12px;
  transition: all 100ms ease-in-out;
  width: 100%;
  width: 100%;
  position: relative;
}


.search-input {
  padding-left: 2.5rem;
  background: transparent;
  border: none;
  border-radius: 12px;
  height: 45px;
  outline: none;
}

.pi-search {
  position: absolute;
  left: 0.8rem;
  color: #94a3b8;
}

.dialog-header-text {
  font-size: 1.5rem;
  color: #1d1d1f;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  /* padding-bottom: 0.5rem; */
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-label {
  font-size: 1rem;
  font-weight: 600;
  color: #334155;
}

.form-field {
  height: 50px;
  width: 100%;
}

.form-input {
  height: 50px;
  border: none;
  background: #F1F1F1;
  border-radius: 12px;
}

.dialog-btn-container {
  display: flex;
  justify-content: flex-end;
}

.dialog-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  height: 50px;
  border-radius: 12px;
  text-transform: capitalize;
  font-weight: 600;
  padding-inline: 2.5rem;
  margin-top: 0.5rem;
  outline: none;
}

.dialog-btn:focus {
  outline: none;
}

.cancel-btn {
  color: gray;
  background-color: transparent;
  outline: none;
  border: none;
  margin-right: 1rem;
  transition: background-color 200ms ease-in;
}

.cancel-btn:hover {
  background: #F1F1F1;
}

.dialog-filecomplaint-icon {
  color: #3b82f6;
  font-size: 1.4rem;
}

.dropdown {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: #F1F1F1;
}

.form-text-input {
  background: #F1F1F1;
  padding-block: 0.8rem;
  border: none;
  border-radius: 12px !important;
}

.form-text-input::-webkit-scrollbar {
  display: none;
}

.empty-data-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-block: 5rem;
  padding-bottom: 6rem;
  margin: 0;
}

.empty-img {
  width: 250px;
  height: 250px;
  object-fit: cover;
}

.empty-text {
  font-size: 1.5rem;
  font-weight: 500;
  color: #334155;
  margin-top: 1.5rem;
}

.status-type {
  font-size: 12px;
  text-transform: capitalize;
  color: #295bac;
  background: #d0e1fd;
  width: fit-content;
  font-weight: 600;
  padding: 7px;
  border-radius: 5px;
}

.paginator-border {
  height: 1px;
  width: 100%;
  background: red;
  position: absolute;
  z-index: 999;
}

.data-table {
  border-bottom: none !important;
}
</style>
