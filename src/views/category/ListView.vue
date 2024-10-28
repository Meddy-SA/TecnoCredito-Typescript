<script setup lang="ts">
import { onMounted } from "vue";
import { useCategoryTable } from "../../composables/category/useCategoryTable.ts";
import Card from "primevue/card";
import Dialog from "primevue/dialog";
import Toolbar from "primevue/toolbar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Button from "primevue/button";
import CreateView from "./CreateView.vue";
import { useAlertStore } from "../../stores";

const alertStore = useAlertStore();

const {
  state,
  filters,
  dtRef,
  categories,
  isLoading,
  selectedCount,
  loadCategories,
  openNewCategory,
  editCategory,
  saveCategory,
  exportToCSV,
} = useCategoryTable();

onMounted(async () => {
  try {
    await loadCategories();
  } catch (error) {
    alertStore.exception(error);
  }
});

const hideDialog = () => {
  state.value.isDialogVisible = false;
  state.value.currentCategory = null;
};

const globalFilterFields = ["name", "description", "parentCategory.name"];
</script>

<template>
  <div>
    <div class="card">
      <Card class="mb-6">
        <template #content>
          <span class="text-2xl text-cyan-900 dark:text-cyan-600">Listado de categorías</span>
        </template>
      </Card>
      <!-- Toolbar -->
      <Toolbar class="mb-6">
        <template #start>
          <Button label="Nueva" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewCategory" />
        </template>

        <template #end>
          <Button label="Exportar" icon="pi pi-upload" severity="help" :disabled="!categories.length"
            @click="exportToCSV" />
        </template>
      </Toolbar>

      <!-- DataTable -->
      <DataTable ref="dtRef" v-model:selection="state.selectedCategories" :value="categories || []" dataKey="id"
        :paginator="true" :rows="10" :filters="filters" :loading="isLoading"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} categorías"
        :globalFilterFields="globalFilterFields" table-style="min-width: 50rem">
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Administrar Categorías</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Buscar Categoría..." />
            </IconField>
          </div>
        </template>

        <!-- Acciones -->
        <Column header="Editar" :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editCategory(slotProps.data)" />
          </template>
        </Column>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column field="name" header="Nombre" sortable style="min-width: 16rem"></Column>
        <Column field="description" header="Descripción" sortable style="min-width: 16rem"></Column>
        <Column field="parentCategory.name" header="Categoría Padre" sortable style="min-width: 16rem"></Column>

        <!-- Footer -->
        <template #footer>
          <div v-if="selectedCount > 0">
            {{ selectedCount }} categorías seleccionadas
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Modal de Edición/Creación -->
    <Dialog v-model:visible="state.isDialogVisible" maximizable :style="{ width: '70vw' }" :header="state.currentCategory?.id ? 'Editar Categoría' : 'Nueva Categoría'
      " :modal="true" class="p-fluid">
      <CreateView :category="state.currentCategory" @submit="saveCategory" @cancel="hideDialog" />
    </Dialog>
  </div>
</template>

<style scoped>
:deep(.p-dialog-content) {
  overflow-y: auto;
  max-height: 80vh;
}
</style>
