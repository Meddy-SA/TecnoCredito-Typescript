<!-- views/credit/AccountView.vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useCreditAccount } from "../../composables/credit/useCreditAccount";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tag from "primevue/tag";
import Card from "primevue/card";
import Chart from "primevue/chart";
import ProgressSpinner from "primevue/progressspinner";

const {
  creditStore,
  expandedRows,
  balanceHistory,
  loadCreditData,
  handleReceiptDownload,
  formatCurrency,
} = useCreditAccount();

// Estado para el gráfico
const chartView = ref<"line" | "bar">("line");

// Función para cambiar la vista del gráfico
const toggleChartView = () => {
  chartView.value = chartView.value === "line" ? "bar" : "line";
};

// Opciones del gráfico tipadas correctamente
const chartOptions = ref({
  plugins: {
    legend: {
      labels: {
        color: "#495057",
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#495057",
      },
      grid: {
        color: "#ebedef",
      },
    },
    y: {
      ticks: {
        color: "#495057",
      },
      grid: {
        color: "#ebedef",
      },
    },
  },
});

// Datos del gráfico tipados correctamente
const chartData = computed(() => ({
  labels: balanceHistory.value.map((item) => item.date),
  datasets: [
    {
      label: "Saldo",
      data: balanceHistory.value.map((item) => item.balance),
      fill: false,
      borderColor: "#42A5F5",
      tension: 0.4,
    },
  ],
}));

onMounted(async () => {
  await loadCreditData();
});

const refreshData = async () => {
  await loadCreditData();
};

const getSeverity = (status: string) => {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "success";
    case "PENDING":
      return "warning";
    case "OVERDUE":
      return "danger";
    default:
      return "info";
  }
};
</script>

<template>
  <div class="card">
    <!-- Loading overlay -->
    <div v-if="creditStore.isLoading" class="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
      <ProgressSpinner />
    </div>

    <!-- Header con información general -->
    <div class="mb-4">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">Cuenta Corriente</h2>
        <Button icon="pi pi-refresh" @click="refreshData" :loading="creditStore.isLoading" />
      </div>
    </div>

    <!-- Resumen de la cuenta -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <Card>
        <template #title>Saldo Total</template>
        <template #content>
          <div class="text-2xl" :class="{
            'text-red-500':
              (creditStore.creditAccount?.totalBalance ?? 0) < 0,
          }">
            {{ formatCurrency(creditStore.creditAccount?.totalBalance ?? 0) }}
          </div>
        </template>
      </Card>

      <Card>
        <template #title>Crédito Disponible</template>
        <template #content>
          <div class="text-2xl text-green-600">
            {{
              formatCurrency(creditStore.creditAccount?.availableCredit ?? 0)
            }}
          </div>
        </template>
      </Card>

      <Card>
        <template #title>Estado</template>
        <template #content>
          <Tag :value="creditStore.creditAccount?.status"
            :severity="getSeverity(creditStore.creditAccount?.status ?? '')" />
        </template>
      </Card>
    </div>

    <!-- Tabla de movimientos -->
    <DataTable :value="creditStore.creditAccount?.movements" v-model:expandedRows="expandedRows" dataKey="id"
      :rowHover="true" removableSort :paginator="true" :rows="10" tableStyle="min-width: 50rem">
      <Column expander style="width: 3rem" />
      <Column field="date" header="Fecha" sortable>
        <template #body="{ data }">
          {{ new Date(data.date).toLocaleDateString() }}
        </template>
      </Column>
      <Column field="type" header="Tipo" sortable>
        <template #body="{ data }">
          <Tag :value="data.type" :severity="getSeverity(data.type)" />
        </template>
      </Column>
      <Column field="amount" header="Monto" sortable>
        <template #body="{ data }">
          {{ formatCurrency(data.amount) }}
        </template>
      </Column>
      <Column field="description" header="Descripción" />
      <Column field="balance" header="Saldo" sortable>
        <template #body="{ data }">
          {{ formatCurrency(data.balance) }}
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="{ data }">
          <Button v-if="data.type === 'PAYMENT'" icon="pi pi-file-pdf" @click="handleReceiptDownload(data.id)" text
            rounded />
        </template>
      </Column>

      <!-- Template para filas expandibles -->
      <template #expansion="slotProps">
        <div class="p-4">
          <!-- Productos (si es un crédito) -->
          <div v-if="slotProps.data.type === 'CREDIT' && slotProps.data.products">
            <h4 class="mb-2">Productos</h4>
            <DataTable :value="slotProps.data.products">
              <Column field="name" header="Producto" />
              <Column field="quantity" header="Cantidad" />
              <Column field="unitPrice" header="Precio Unitario">
                <template #body="{ data }">
                  {{ formatCurrency(data.unitPrice) }}
                </template>
              </Column>
              <Column field="totalPrice" header="Total">
                <template #body="{ data }">
                  {{ formatCurrency(data.totalPrice) }}
                </template>
              </Column>
            </DataTable>
          </div>

          <!-- Detalles (si es un impuesto o interés) -->
          <div v-if="
            ['TAX', 'INTEREST'].includes(slotProps.data.type) &&
            slotProps.data.details
          ">
            <h4 class="mb-2">
              Detalles del
              {{ slotProps.data.type === "TAX" ? "Impuesto" : "Interés" }}
            </h4>
            <DataTable :value="slotProps.data.details">
              <Column field="concept" header="Concepto" />
              <Column field="amount" header="Monto">
                <template #body="{ data }">
                  {{ formatCurrency(data.amount) }}
                </template>
              </Column>
              <Column field="description" header="Descripción" />
            </DataTable>
          </div>

          <!-- Detalles del pago -->
          <div v-if="slotProps.data.type === 'PAYMENT'">
            <div class="flex justify-between items-center">
              <h4>Detalles del Pago</h4>
              <Button label="Descargar Comprobante" icon="pi pi-download"
                @click="handleReceiptDownload(slotProps.data.id)" size="small" />
            </div>
            <div class="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p class="font-semibold">Número de Comprobante:</p>
                <p>{{ slotProps.data.receipt }}</p>
              </div>
              <div>
                <p class="font-semibold">Estado del Pago:</p>
                <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataTable>

    <!-- Gráfico de evolución del saldo -->
    <Card class="mt-6">
      <template #title>
        <div class="flex justify-between items-center">
          <span>Evolución del Saldo</span>
          <div class="flex gap-2">
            <Button icon="pi pi-chart-line" severity="secondary" text @click="toggleChartView" />
          </div>
        </div>
      </template>
      <template #content>
        <div class="w-full" style="height: 300px">
          <Chart :type="chartView" :data="chartData" :options="chartOptions" />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.p-card {
  margin-bottom: 1rem;
}

:deep(.p-datatable-header) {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

:deep(.p-card-content) {
  padding: 0;
}

.chart-container {
  position: relative;
  height: 300px;
}
</style>
