<template>
  <MainLayout>
    <div class="complaints">
      <div class="data-table-container">
        <header class="data-table-header">
          <div class="add-btn-container">
            <Button class="add-btn" @click="isDialogVisible = true">
              <i class="pi pi-plus"></i>
              File complaint
            </Button>
          </div>
          <div class="search-container">
            <i class="pi pi-search" />
            <InputText
              v-model="globalFilter"
              placeholder="Keyword search."
              class="search-input"
            />
          </div>
        </header>
        <DataTable
          v-if="complaints"
          v-model:selection="selectedItem"
          :value="filteredData"
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          size="large"
          stripedRows
          paginator
          removableSort
          :metaKeySelection="metaKey"
          dataKey="id"
          selectionMode="single"
          class="data-table"
          :globalFilter="globalFilter"
          scrollable
          scrollHeight="calc(100vh - 220px)"
          columnResizeMode="fit"
        >
          <Column
            style="padding-inline: 2rem"
            field="id"
            header="Id"
            sortable
          ></Column>
          <Column field="respondentName" header="Respondent" sortable></Column>
          <Column field="crimeType" header="Crime type"></Column>
          <Column field="crimeOverview" header="Crime overview" style="max-width: 500px; height: auto;">
          </Column>
          <Column header="Status">
            <template #body="">
              <Tag value="Pending" />
            </template>
          </Column>
          <Column
            style="padding-inline: 2rem"
            field="createdAt"
            header="Created at"
            sortable
          ></Column>
          <template #empty>
            <div class="empty-data-container">
              <img src="/no-data.png" alt="No data" class="empty-img">
              <div class="empty-text">No data found.</div>
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
    style="width: 470px; padding-left: 0.2rem"
  >
    <template #header>
      <!-- <i class="pi pi-plus dialog-filecomplaint-icon"></i> -->
      <span class="dialog-header-text">File complaint</span>
    </template>
    <div class="form-group">
      <label class="form-label">Respondent</label>
      <InputGroup class="field-group">
        <!-- <InputGroupAddon class="form-addon">
          <i class="pi pi-user form-icon"></i>
        </InputGroupAddon> -->
        <InputText
          placeholder="Enter respondent"
          class="form-input"
          v-model="respondent"
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
      />
    </div>
    <div class="form-group">
      <label class="form-label">Crime overview</label>
      <InputGroup class="field-group">
        <Textarea
          rows="4"
          cols="40"
          style="max-height: 100px; border-radius: 7px"
          placeholder="Tell us what happened."
          v-model="crimeOverview"
          autoResize
          class="form-text-input"
        />
      </InputGroup>
    </div>
    <div class="dialog-btn-container">
      <Button class="dialog-btn" @click="onSubmit" autofocus>
        Submit
      </Button>
    </div>
  </Dialog>
  <Toast position="top-center"  />
</template>

<script setup>
import { ref, computed } from "vue";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import Tag from "primevue/tag";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

import { useUserStore } from "~/stores/user";
import MainLayout from "~/layouts/MainLayout.vue";

const user = useSupabaseUser();
const userStorage = useUserStore();
const toast = useToast();

const complaints = ref([]);
const selectedItem = ref();
const metaKey = ref(true);
const globalFilter = ref("");
const isDialogVisible = ref(false);

const respondent = ref("");
const crimeType = ref("");
const crimeOverview = ref("");

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

const getSeverity = (product) => {
  switch (product.inventoryStatus) {
    case "pending":
      return "info";

    case "scheduled":
      return "warning";

    case "resolved":
      return "success";

    default:
      return null;
  }
};

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
          life: 7000 
        });
      }, 200)
    }
  } catch (err) {
    console.log(err);
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
.data-table {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.data-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-btn-container {
  padding-inline: 2rem;
}

.add-btn {
  display: flex;
  gap: 0.5rem;
  border-radius: 50px;
  text-transform: capitalize;
  font-weight: 500;
  height: 45px;
  outline: 2px solid #85b2f9;
  outline-offset: 2px;
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  /* border: 1px solid #94a3b8; */
  margin-inline: 2rem;
  margin-block: 1rem;
  position: relative;
  background: #f2f5fa;
  border-radius: 5px;
  transition: all 100ms ease-in-out;
}

.search-container:focus-within {
  box-shadow: 0 0 5px #0557db;
}

.search-input {
  outline: none;
  padding-left: 2.3rem;
  background: transparent;
  border: none;
  border-radius: 5px;
  height: 45px;
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
  gap: 0.3rem;
  margin-bottom: 1.5rem;
}

.form-label {
  font-size: 1rem;
  font-weight: 500;
  color: #334155;
}

.form-field {
  height: 45px;
  width: 100%;
  background: #f2f5fa;
}

.form-input {
  height: 45px;
  border: none;
  background: #f2f5fa;
}

.dialog-btn-container {
  display: flex;
  justify-content: center;
}

.dialog-btn {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  height: 50px;
  border-radius: 50px;
  text-transform: capitalize;
  font-weight: 500;
  padding-inline: 2.5rem;
  outline: 2px solid #85b2f9;
  outline-offset: 2px;
  margin-top: 0.5rem;
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
  background: #f2f5fa;
}

.form-text-input {
  background: #f2f5fa;
  padding-block: 0.8rem;
  border: none;
}

.empty-data-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-block: 3rem;
  padding-top: 1.5rem;
  margin: 0;
}

.empty-img {
  width: 200px;
  height: 200px;
  object-fit: cover;
}

.empty-text {
  font-size: 1.5rem;
  font-weight: 500;
  color: #1d1d1f;
  margin-top: 10px;
}
</style>
