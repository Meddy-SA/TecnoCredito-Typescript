<script setup lang="ts">
import { onMounted } from "vue";
import { useProductTable } from "../../composables/product/useProductTable";
import Card from "primevue/card";
import Dialog from "primevue/dialog";
import Toolbar from "primevue/toolbar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
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
  products,
  isLoading,
  selectedCount,
  loadProducts,
  openNewProduct,
  editProduct,
  saveProduct,
  exportToCSV,
  formatCurrency,
} = useProductTable();

onMounted(async () => {
  try {
    await loadProducts();
  } catch (error) {
    alertStore.exception(error);
  }
});

const hideDialog = () => {
  state.value.isDialogVisible = false;
  state.value.currentProduct = null;
};

const globalFilterFields = [
  "name",
  "description",
  "category.name",
  "brand",
  "model",
  "sku",
];
</script>
<template>
  <div>
    <div class="card">
      <Card class="mb-6">
        <template #content>
          <span class="text-2xl text-cyan-900 dark:text-cyan-600">Listado de productos</span>
        </template>
      </Card>
      <!-- Toolbar -->
      <Toolbar class="mb-6">
        <template #start>
          <Button label="Nuevo" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewProduct" />
        </template>

        <template #end>
          <Button label="Exportar" icon="pi pi-upload" severity="help" :disabled="!products.length"
            @click="exportToCSV" />
        </template>
      </Toolbar>

      <!-- DataTable -->
      <DataTable ref="dtRef" v-model:selection="state.selectedProducts" :value="products" dataKey="id" :paginator="true"
        :rows="10" :filters="filters" :loading="isLoading"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} productos"
        :globalFilterFields="globalFilterFields" table-style="min-width: 50rem">
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Administrar Productos</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Buscar Producto..." />
            </IconField>
          </div>
        </template>
        <!-- Columnas -->
        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column field="name" header="Nombre" sortable style="min-width: 16rem"></Column>
        <Column field="description" header="Descripción" sortable style="min-width: 16rem"></Column>
        <Column field="price" header="Precio" sortable style="min-width: 8rem">
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.price) }}
          </template>
        </Column>
        <Column field="stockQuatity" header="Stock" sortable style="min-width: 8rem"></Column>
        <Column field="category.name" header="Categoria" sortable style="min-width: 10rem"></Column>
        <Column field="brand" header="Marca" sortable style="min-width: 10rem"></Column>
        <Column field="model" header="Modelo" sortable style="min-width: 10rem"></Column>
        <Column field="sku" header="SKU" sortable style="min-width: 10rem"></Column>
        <Column field="status.name" header="Estado" sortable style="min-width: 10rem">
          <template #body="slotProps">
            <Tag :value="slotProps.data.status.name" :severity="slotProps.data.status.severity ?? 'success'" />
          </template>
        </Column>
        <!-- Acciones -->
        <Column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
            <Button icon="pi pi-trash" outlined rounded severity="danger" />
          </template>
        </Column>
        <!-- Footer -->
        <template #footer>
          <div v-if="selectedCount > 0">
            {{ selectedCount }} productos seleccionados
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Modal de Edición/Creación -->
    <Dialog v-model:visible="state.isDialogVisible" maximizable :style="{ width: '70vw' }"
      :header="state.currentProduct?.id ? 'Editar Producto' : 'Nuevo Producto'" :modal="true">
      <CreateView :product="state.currentProduct" @submit="saveProduct" @cancel="hideDialog" />
    </Dialog>
  </div>
</template>

<style scoped>
:deep(.p-dialog-content) {
  overflow-y: auto;
  max-height: 80vh;
}
</style>
