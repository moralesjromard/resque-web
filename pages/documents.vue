<template>
  <MainLayout>
    <div class="documents">
      <div class="data-table-container">
        <DataTable
          v-model:selection="selectedItem"
          :value="filteredData"
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          size="large"
          stripedRows
          removableSort
          :metaKeySelection="metaKey"
          dataKey="id"
          selectionMode="single"
          class="data-table"
          :globalFilter="globalFilter"
          scrollable
          scrollHeight="calc(100vh - 201px)"
          columnResizeMode="fit"
          paginator
          paginatorPosition="top"
        >
          <template #paginatorstart>
            <div class="add-btn-container">
              <Button class="add-btn" @click="isDialogVisible = true">
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
            style="padding-inline: 2rem"
            field="id"
            header="Id"
            sortable
          ></Column>
          <Column field="documentType" header="Document type" sortable></Column>
          <Column field="purpose" header="Purpose" style="max-width: 500px; height: auto;"></Column>
          <Column field="urgen" header="Urgency level"></Column>
          <Column header="Status">
            <template #body="slotProps">
              <!-- <Tag :value="slotProps.data.status" style="text-transform: capitalize;" /> -->
              <div class="status-type">
                {{ slotProps.data.status }}
              </div>
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
    style="width: 500px; padding: 0.5rem; border-radius: 15px; background-color: white;"
  >
    <template #header>
      <!-- <i class="pi pi-plus dialog-filecomplaint-icon"></i> -->
      <span class="dialog-header-text">Request a document</span>
    </template>
    <div class="form-group">
      <div class="form-group">
        <label class="form-label">Document type</label>
        <Dropdown
          v-model="documentType"
          :options="documentTypes"
          optionLabel="name"
          placeholder="Select document type"
          class="dropdown"
        />
      </div>
      <label class="form-label">Purpose</label>
      <InputGroup class="field-group">
        <InputText
          placeholder="What's your purpose?"
          class="form-input"
          v-model="purpose"
        />
      </InputGroup>
    </div>
    <div class="form-group">
      <label class="form-label">How urgently do you need it?</label>
      <Dropdown
        v-model="urgent"
        :options="urgentList"
        optionLabel="name"
        placeholder="Select urgency level"
        class="dropdown"
      />
    </div>
    <div class="dialog-btn-container">
      <Button type="button" class="dialog-btn cancel-btn" @click="isDialogVisible = false" autofocus>
        Cancel
      </Button>
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
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

import MainLayout from "~/layouts/MainLayout.vue";
import { useUserStore } from "~/stores/user";

const user = useSupabaseUser();
const userStorage = useUserStore();

const toast = useToast();

const documents = ref([]);
const selectedItem = ref();
const metaKey = ref(true);
const globalFilter = ref("");
const isDialogVisible = ref(false);

const documentType = ref("");
const purpose = ref("");
const urgent = ref("");

const documentTypes = ref([
  { name: "Permit" },
  { name: "Cedula" },
  { name: "Clearance" },
]);

const urgentList = ref([
  { name: "In the next 48 hours" },
  { name: "Within 1 to 3 weeks" },
  { name: "Not urgent" },
]);

const filteredData = computed(() => {
  const filterText = globalFilter.value.toLowerCase();

  return documents?.value.filter(
    (item) =>
      item.id.toString().includes(filterText) ||
      item.status.toLowerCase().includes(filterText) ||
      item.documentType.toLowerCase().includes(filterText) ||
      item.urgent.toLowerCase().includes(filterText)
  );
});

const getDocuments = async () => {
  const res = await $fetch(
    `/api/prisma/get-all-documents-by-user/${user.value.id}`
  );

  try {
    if (res) {
      documents.value = res;
      console.log(res);
    } 
  } catch (err) {
    console.log(err);
  }
};

const onSubmit = async () => {
  const payload = {
    userId: user.value.id,
    documentType: documentType.value.name,
    purpose: purpose.value,
    urgent: urgent.value.name
  };
  const res = await useFetch(`/api/prisma/add-document-request/`, {
    method: "POST",
    body: payload,
  });

  try {
    if (res) {
      documentType.value = "";
      purpose.value = "";
      getDocuments();
      setTimeout(() => {
        isDialogVisible.value = false;
        toast.add({ 
          severity: 'success', 
          summary: 'Request submitted successfully', 
          detail: 'Your document request has been received, and our team will review it promptly. You can expect a response within 24 hours.', 
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
    await getDocuments();
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
  border-radius: 5px;
  transition: all 100ms ease-in-out;
  width: 100%;
  width: 100%;
  position: relative;
}


.search-input {
  padding-left: 2.5rem;
  background: transparent;
  border: none;
  border-radius: 5px;
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
  background: #f7f7f7;
}

.form-input {
  height: 50px;
  border: none;
  background: #f7f7f7;
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
  border-radius: 5px;
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
  background: transparent;
  outline: none;
  border: none;
  margin-right: 1rem;
  background: #f7f7f7;
}

.cancel-btn:hover {
  background: #e5e5e5;
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
  background: #f7f7f7;
}

.form-text-input {
  background: #f7f7f7;
  padding-block: 0.8rem;
  border: none;
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
  color: #1d1d1f;
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
</style>
