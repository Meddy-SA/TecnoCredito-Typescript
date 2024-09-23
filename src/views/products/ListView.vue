<script setup lang="ts">
import { ref, onMounted } from "vue";
import { FilterMatchMode } from "@primevue/core/api";
import CreateView from "./CreateView.vue";

import type { ProductDTO } from "../../services/product/types";
import { createEmptyProductDTO } from "../../services/product/types";
import { useProductStore } from "../../stores/products";

const productStore = useProductStore();

onMounted(async () => {
  await loadProducts();
});

const dt = ref();
const products = ref<ProductDTO[]>([]);
const productDialog = ref(false);
const product = ref<ProductDTO>(createEmptyProductDTO());
const selectedProducts = ref<ProductDTO[]>([]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Methods

const loadProducts = async () => {
  const res = await productStore.dispatchGetProducts();
  if (res.success) {
    products.value = productStore.products;
  }
};

const formatCurrency = (value: number) => {
  return (
    value?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    }) ?? ""
  );
};

const openNew = () => {
  product.value = createEmptyProductDTO();
  productDialog.value = true;
};

const hideDialog = () => {
  productDialog.value = false;
};

const saveProduct = async (savedProduct: ProductDTO) => {
  if (savedProduct.id) {
    // await productStore.dispatchUpdateProduct(savedProduct);
  } else {
    // await productStore.dispatchAddProduct(savedProduct);
  }

  await loadProducts();
  productDialog.value = false;
};

const editProduct = (prod: ProductDTO) => {
  product.value = { ...prod };
  productDialog.value = true;
};

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
        </template>

        <template #end>
          <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import"
            class="mr-2" auto />
          <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV()" />
        </template>
      </Toolbar>

      <DataTable ref="dt" v-model:selection="selectedProducts" :value="products" dataKey="id" :paginator="true"
        :rows="10" :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Administrar Productos</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Buscar..." />
            </IconField>
          </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column field="name" header="Name" sortable style="min-width: 16rem"></Column>
        <Column field="description" header="Descripción" sortable style="min-width: 16rem"></Column>
        <Column field="price" header="Price" sortable style="min-width: 8rem">
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.price) }}
          </template>
        </Column>
        <Column field="stockQuatity" header="Stock" sortable style="min-width: 8rem"></Column>
        <Column field="category.name" header="Category" sortable style="min-width: 10rem"></Column>
        <Column field="brand" header="Brand" sortable style="min-width: 10rem"></Column>
        <Column field="model" header="Model" sortable style="min-width: 10rem"></Column>
        <Column field="sku" header="SKU" sortable style="min-width: 10rem"></Column>
        <Column field="status.name" header="Status" sortable style="min-width: 10rem">
          <template #body="slotProps">
            <Tag :value="slotProps.data.status.name" :severity="slotProps.data.status.severity ?? 'success'" />
          </template>
        </Column>
        <Column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
            <Button icon="pi pi-trash" outlined rounded severity="danger" />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Product Details" :modal="true">
      <CreateView :product="product" @submit="saveProduct" @cancel="hideDialog" />
    </Dialog>
  </div>
</template>
