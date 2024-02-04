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
          scrollHeight="calc(100vh - 201px)"
        >
          <Column
            style="padding-inline: 2rem"
            field="id"
            header="Id"
            sortable
          ></Column>
          <Column field="status" header="Status" sortable></Column>
          <Column field="crime_type" header="Crime type" sortable></Column>
          <Column
            field="respondent_name"
            header="Respondent name"
            sortable
          ></Column>
          <Column
            style="padding-inline: 2rem"
            field="created_at"
            header="Created at"
            sortable
          ></Column>
        </DataTable>
      </div>
    </div>
  </MainLayout>

  <Dialog
    v-model:visible="isDialogVisible"
    modal
    header="Add Complaint"
    style="width: 450px; padding-inline: 0.3rem"
  >
    <template #header>
      <i class="pi pi-plus dialog-filecomplaint-icon"></i>
      <span class="dialog-header-text">File complaint</span>
    </template>
    <div class="form-group">
      <label class="form-label">Respondent name</label>
      <InputGroup class="field-group">
        <InputGroupAddon class="form-addon">
          <i class="pi pi-user form-icon"></i>
        </InputGroupAddon>
        <InputText placeholder="Enter respondent" class="form-input" />
      </InputGroup>
    </div>
    <div class="form-group">
      <label class="form-label">Crime type</label>
      <Dropdown
        v-model="selectedCrimeType"
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
          v-model="value"
          rows="3"
          cols="30"
          style="max-height: 100px; border-radius: 7px"
          placeholder="Tell us what happened."
          autoResize="false"
        />
      </InputGroup>
    </div>
    <Button class="dialog-btn" @click="visible = false" autofocus>
      Submit complaint
    </Button>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";

import MainLayout from "~/layouts/MainLayout.vue";
import { complaintsData } from "~/data.ts";

const complaints = ref([]);
const selectedItem = ref();
const metaKey = ref(true);
const globalFilter = ref("");
const isDialogVisible = ref(false);

const selectedCrimeType = ref();
const crimeTypes = ref([
  { name: "Blotter" },
  { name: "Criminal Case" },
  { name: "Civil Case" },
]);

onMounted(() => {
  complaints.value = complaintsData;
});

const filteredData = computed(() => {
  const filterText = globalFilter.value.toLowerCase();

  return complaints.value.filter(
    (item) =>
      item.id.toString().includes(filterText) ||
      item.status.toLowerCase().includes(filterText) ||
      item.crime_type.toLowerCase().includes(filterText) ||
      item.respondent_name.toLowerCase().includes(filterText)
  );
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
}

.search-input {
  outline: none;
  padding-left: 2.3rem;
}

.pi-search {
  position: absolute;
  left: 0.8rem;
  color: #94a3b8;
}

.dialog-header-text {
  font-size: 1.3rem;
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
  gap: 0.3rem;
  margin-bottom: 1rem;
}

.form-label {
  font-size: 1rem;
  font-weight: 500;
  color: #334155;
}

.form-field {
  height: 45px;
  width: 100%;
}

.form-input {
  height: 45px;
}

.dialog-btn {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  height: 45px;
  margin-top: 1.5rem;
  border-radius: 50px;
}

.dialog-filecomplaint-icon {
  color: #3b82f6;
  font-size: 1.1rem;
}

.dropdown {
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
