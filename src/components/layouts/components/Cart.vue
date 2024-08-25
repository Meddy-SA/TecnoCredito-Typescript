<script setup lang="ts">
import { computed, ref } from "vue";

import Button from "primevue/button";
import Popover from "primevue/popover";
import DataTable, {
  type DataTableCellEditCompleteEvent,
} from "primevue/datatable";
import Column from "primevue/column";
import MeterGroup from "primevue/metergroup";
import InputNumber from "primevue/inputnumber";

// refs
const op = ref();
// variables
const limit = 2000;
const quantity = ref(0);
const meterValue = ref([
  { label: "Crédito ocupado", value: 15, color: "var(--p-primary-color)" },
]);

const products = ref([
  {
    name: "Cable HDMI",
    quantity: 1,
    unitPrice: 25.5,
    price: 25.5,
    description: "2.0 4K 2.1",
  },
  {
    name: "Cable USB",
    quantity: 1,
    unitPrice: 15.5,
    price: 15.5,
    description: "USC C, negro",
  },
]);

// methods

const toggle = (event: Event) => {
  op.value.toggle(event);
};

const deleteProduct = (index: number) => {
  products.value.splice(index, 1);
};

const onCellEditComplete = (event: DataTableCellEditCompleteEvent) => {
  const { data, field, newValue, originalEvent } = event;

  if (isPositiveInteger(newValue)) {
    data[field] = newValue;
    data["price"] = data["unitPrice"] * newValue;
  } else originalEvent.preventDefault();
};

const isPositiveInteger = (val: number) => {
  let str = String(val);

  str = str.trim();

  if (!str) {
    return false;
  }

  str = str.replace(/^0+/, "") || "0";
  var n = Math.floor(Number(str));

  return n !== Infinity && String(n) === str && n >= 0;
};

const formatCurrency = (value: number) => {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

const totalProducts = computed(() => {
  let total = 0;
  for (let sale of products.value) {
    total += sale.price;
  }

  quantity.value = products.value.length;
  // calcular del limit el total ocupado.
  const percent = (total / limit) * 100;
  meterValue.value[0].value = percent;

  return formatCurrency(total);
});
</script>

<template>
  <Button label="Mi carrito" icon="pi pi-shopping-cart" @click="toggle" text rounded raised plain size="small"
    badge="2" />
  <Popover ref="op">
    <div class="flex flex-col gap-4 text-xs w-[25rem]">
      <div class="flex justify-between m-0">
        <span>Tu carrito de compras</span>
        <span>{{ quantity }} productos</span>
      </div>
      <div>
        <MeterGroup :value="meterValue" />
      </div>
      <div>
        <DataTable :value="products" size="small" editMode="cell" @cell-edit-complete="onCellEditComplete" scrollable
          scrollHeight="220px">
          <Column field="name" header="Nombre">
            <template #body="{ data, field }">
              <div class="flex-1">
                <span class="text-gray-700 dark:text-gray-300">
                  {{ data[field] }}
                </span>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  {{ data["description"] }}
                </p>
              </div>
            </template>
          </Column>
          <Column field="quantity" header="Cant.">
            <template #body="{ data, field }">
              {{ data[field] }}
            </template>
            <template #editor="{ data, field }">
              <InputNumber v-model="data[field]" showButtons buttonLayout="horizontal" :min="1" :max="99" autofocus
                fluid />
            </template>
          </Column>
          <Column field="price" header="Precio"></Column>
          <Column>
            <template #body="{ index }">
              <Button icon="pi pi-trash" severity="danger" text rounded aria-label="Eliminar"
                @click="deleteProduct(index)" size="small" />
            </template>
          </Column>
        </DataTable>
        <div class="block">
          <div class="flex justify-between">
            <span>Total</span>
            <span>{{ totalProducts }}</span>
          </div>
        </div>
      </div>

      <div>
        <Button label="Ver carrito" class="w-full" />
      </div>
    </div>
  </Popover>
</template>
