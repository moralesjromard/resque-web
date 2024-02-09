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
            <div class="header-buttons">
              <div class="add-btn-container">
                <Button class="add-btn" @click="isDialogVisible = true" type="button">
                  <i class="pi pi-plus"></i>
                  Add
                </Button>
              </div>
              <div class="delete-btn-container">
                <Button 
                  :disabled="!isDeletedDisabled" 
                  class="delete-btn p-button-danger" 
                  @click="deleteConfirmationDialog"
                  
                >
                  <i class="pi pi-trash" /> 
                  Delete
                </Button>
              </div>
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
          <Column selectionMode="multiple" headerStyle="width: 3rem" style="padding-inline: 4rem"></Column>
          <Column
            style="padding-inline: 4rem"
            field="id"
            header="Id"
            sortable
          ></Column>
          <Column field="documentType" header="Document type" sortable></Column>
          <Column field="purpose" header="Purpose" style="max-width: 500px; height: auto;"></Column>
          <Column field="urgent" header="Urgency level"></Column>
          <Column header="Status">
            <template #body="slotProps">
              <!-- <Tag :value="slotProps.data.status" style="text-transform: capitalize;" /> -->
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
    header="Request documents"
    style="width: 490px; padding: 0.5rem; border-radius: 5px; background-color: white;"
  >
    <template #header>
      <span class="dialog-header-text">Request a document</span>
    </template>
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label class="form-label">Document type</label>
        <Dropdown
          v-model="documentType"
          :options="documentTypes"
          optionLabel="name"
          placeholder="Select document type"
          class="dropdown"
          required
        />
      </div>
      <div class="form-group">
        <label class="form-label">Purpose</label>
        <InputGroup class="field-group">
          <InputText
            placeholder="What's your purpose?"
            class="form-input"
            v-model="purpose"
            required
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
          required
        />
      </div>
      <div class="dialog-btn-container">
        <Button 
          type="button" 
          class="dialog-btn cancel-btn" 
          @click="() => {
            isDialogVisible = false;
            documentType = null;
            purpose = null;
            urgent = null;
          }" 
          autofocus
        >
          Cancel
        </Button>
        <Button class="dialog-btn" autofocus type="submit">
          Submit
        </Button>
      </div>
    </form>
  </Dialog>
  <Toast position="top-center" />
  <ConfirmDialog />
</template>

<script setup>
import { ref, computed } from "vue";
import { useDayjs } from '#dayjs'

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

import MainLayout from "~/layouts/MainLayout.vue";
import { useUserStore } from "~/stores/user";

const user = useSupabaseUser();
const userStorage = useUserStore();
const dayjs = useDayjs();

const toast = useToast();

const documents = ref([]);
const selectedItem = ref([]);
const metaKey = ref(true);
const globalFilter = ref("");
const isDialogVisible = ref(false);
let isDeletedDisabled = ref(true);

const documentType = ref("");
const purpose = ref("");
const urgent = ref("");
const confirm = useConfirm();

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

const deleteConfirmationDialog = () => {
  confirm.require({
    message: 'Do you want to delete this request?',
    header: 'Danger Zone',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      deleteSelectedRequest();
    },
    reject: () => {
    }
  });
};

const getDocuments = async () => {
  const res = await $fetch(
    `/api/prisma/get-all-documents-by-user/${user.value.id}`
  );

  try {
    if (res) {
      documents.value = res;
    } 
  } catch (err) {
    console.log(err);
  }
};

const deleteSelectedRequest = async () => {
  const selectedIdsArray = selectedItem.value.map(item => item.id);

  const res = await useFetch(`/api/prisma/delete-selected-documents/${selectedIdsArray.join(',')}`, {
    method: 'DELETE'
  });

  try {
    if (res) {
      setTimeout(() => {
        getDocuments();
        toast.add({ 
          severity: 'success', 
          summary: 'Request deleted successfully', 
          detail: 'Your request has been deleted.', 
          life: 5000 
        });
        isDeletedDisabled.value = false;
      }, 200);
    }
  } catch (error) {
    console.log(error.message);
  }
}

const onSubmit = async () => {
  if (documentType.value && purpose.value && urgent.value) {
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
    await getDocuments();
    userStorage.isLoading = false;
  }, 300);
});

watchEffect(() => {
  if (selectedItem.value.length) {
    isDeletedDisabled.value = true;
  } else {
    isDeletedDisabled.value = false;
  }

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
  border-radius: 5px;
  text-transform: capitalize;
  font-weight: 600;
  height: 45px;
  margin-right: 1rem;
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
  border-radius: 5px;
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
  color: #64748b;
  background-color: transparent;
  outline: none;
  border: none;
  margin-right: 2rem;
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
  border-radius: 5px;
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

.delete-btn {
  display: flex;
  gap: 0.5rem;
  border-radius: 5px;
  text-transform: capitalize;
  font-weight: 600;
  height: 45px;
  margin-right: 1rem;
  background-color: #e44444;
  border: none;
}

.delete-btn:hover {
  background-color: #DC2626;
}

.header-buttons {
  display: flex;
}
</style>