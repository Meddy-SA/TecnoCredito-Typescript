// views/payments/CreatePayment.vue
<script setup lang="ts">
import { ref } from "vue";
import { usePaymentForm } from "../../composables/payment/usePaymentForm";
import { useAlertStore } from "../../stores";
import Stepper from "primevue/stepper";
import StepItem from "primevue/stepitem";
import Step from "primevue/step";
import StepPanel from "primevue/steppanel";
import Button from "primevue/button";
import Card from "primevue/card";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import InputText from "primevue/inputtext";
import Tag from "primevue/tag";

const alertStore = useAlertStore();
const currentStep = ref("1");

const {
  selectedPaymentMethods,
  paymentMethods,
  creditSummary,
  isLoading,
  totalAmount,
  addPaymentMethod,
  removePaymentMethod,
  handleSubmit,
} = usePaymentForm(async (savedPayment) => {
  try {
    // Lógica para guardar el pago
    console.log("Guardando Pago:", savedPayment);
    currentStep.value = "2"; // Avanzar al paso de confirmación
  } catch (error) {
    alertStore.exception(error);
  }
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
};

const resetForm = () => { };

const downloadReceipt = () => { };
const handleStepActivation = (activateCallback: () => void) => {
  // Lógica adicional si es necesaria
  activateCallback();
};
</script>

<template>
  <div class="card">
    <Stepper v-model="currentStep">
      <!-- Paso 1: Registro de Pago -->
      <StepItem value="1">
        <Step>Registro de Pago</Step>
        <StepPanel v-slot="{ activateCallback }">
          <div class="flex flex-col gap-4 p-4">
            <!-- Resumen del Crédito -->
            <Card v-if="creditSummary" class="w-full" @click="handleStepActivation(activateCallback)">
              <template #title> Resumen de Cuenta </template>
              <template #content>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <h4>Cliente</h4>
                    <p>{{ creditSummary.customerName }}</p>
                  </div>
                  <div>
                    <h4>Estado</h4>
                    <Tag :value="creditSummary.creditStatus" :severity="creditSummary.balance > 0 ? 'danger' : 'success'
                      " />
                  </div>
                  <div>
                    <h4>Saldo</h4>
                    <p :class="creditSummary.balance > 0
                        ? 'text-red-500'
                        : 'text-green-500'
                      ">
                      {{ formatCurrency(creditSummary.balance) }}
                    </p>
                  </div>
                  <div>
                    <h4>Cuotas Pendientes</h4>
                    <p>{{ creditSummary.pendingInstallments }}</p>
                  </div>
                </div>
              </template>
            </Card>

            <!-- Métodos de Pago -->
            <div class="w-full">
              <div class="flex justify-between items-center mb-4">
                <h3>Métodos de Pago</h3>
                <Button icon="pi pi-plus" @click="addPaymentMethod" label="Agregar Método" outlined />
              </div>

              <div class="flex flex-col gap-4">
                <div v-for="(method, index) in selectedPaymentMethods" :key="index" class="p-4 border rounded">
                  <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-4">
                      <span class="p-float-label">
                        <Select v-model="method.paymentMethodId" :options="paymentMethods" optionLabel="name"
                          optionValue="id" class="w-full" />
                        <label>Método de Pago</label>
                      </span>
                    </div>
                    <div class="col-span-4">
                      <span class="p-float-label">
                        <InputNumber v-model="method.amount" mode="currency" currency="ARS" locale="es-AR"
                          class="w-full" />
                        <label>Monto</label>
                      </span>
                    </div>
                    <div class="col-span-3">
                      <span class="p-float-label">
                        <InputText v-model="method.reference" class="w-full" />
                        <label>Referencia</label>
                      </span>
                    </div>
                    <div class="col-span-1 flex items-center">
                      <Button icon="pi pi-trash" severity="danger" @click="removePaymentMethod(index)" outlined
                        rounded />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Total -->
              <div class="flex justify-end mt-4">
                <div class="text-xl">
                  Total: {{ formatCurrency(totalAmount) }}
                </div>
              </div>
            </div>

            <!-- Botón de Confirmación -->
            <div class="flex justify-end py-4">
              <Button label="Confirmar Pago" @click="handleSubmit" icon="pi pi-check" :loading="isLoading"
                :disabled="!selectedPaymentMethods.length" />
            </div>
          </div>
        </StepPanel>
      </StepItem>

      <!-- Paso 2: Confirmación -->
      <StepItem value="2">
        <Step>Confirmación</Step>
        <StepPanel>
          <div class="flex flex-col items-center gap-4 p-4">
            <i class="pi pi-check-circle text-6xl text-green-500"></i>
            <h2>¡Pago Registrado Exitosamente!</h2>

            <!-- Resumen del Pago -->
            <Card class="w-full">
              <template #title> Comprobante de Pago </template>
              <template #content>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <h4>Cliente</h4>
                    <p>{{ creditSummary?.customerName }}</p>
                  </div>
                  <div>
                    <h4>Total Pagado</h4>
                    <p>{{ formatCurrency(totalAmount) }}</p>
                  </div>
                  <!-- Detalles de los métodos de pago utilizados -->
                  <div class="col-span-2">
                    <h4>Métodos de Pago Utilizados</h4>
                    <div v-for="(method, index) in selectedPaymentMethods" :key="index"
                      class="flex justify-between py-2">
                      <span>{{
                        paymentMethods.find(
                          (m) => m.id === method.paymentMethodId
                        )?.name
                      }}</span>
                      <span>{{ formatCurrency(method.amount) }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </Card>

            <div class="flex gap-4">
              <Button label="Descargar Comprobante" icon="pi pi-download" @click="downloadReceipt" />
              <Button label="Nuevo Pago" icon="pi pi-plus" @click="resetForm" outlined />
            </div>
          </div>
        </StepPanel>
      </StepItem>
    </Stepper>
  </div>
</template>
