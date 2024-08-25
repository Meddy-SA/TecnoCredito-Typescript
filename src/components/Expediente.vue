<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAlertStore } from "../stores";
import { useHumanoStore } from "../stores/humano";
import Button from "primevue/button";
import InputGroup from "primevue/inputgroup";
import InputMask from "primevue/inputmask";

const emit = defineEmits(["onGetExpediente", "onCleanExpediente"]);
const alerts = useAlertStore();
const humano = useHumanoStore();
const loading = ref(false);
const expediente = ref(); // Ref to inputmask
const expedienteCargado = ref(false);
const iconButton = ref("pi pi-check");
const expedienteNumber = ref("");

onMounted(() => {
  expediente.value.$el.focus();
});

const onClickButton = async () => {
  loading.value = true;
  if (expedienteCargado.value) {
    cleanExpediente();
  } else {
    await getDesarrolloHumano();
  }
};

const getDesarrolloHumano = async () => {
  if (expedienteNumber.value === "") {
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    const { success } = await humano.dispatchGetExpediente(
      expedienteNumber.value
    );
    if (success) {
      iconButton.value = "pi pi-refresh";
      expedienteCargado.value = true;
      humano.state!.id = humano.state?.id === -1 ? 0 : humano.state!.id;
      humano.state!.expediente =
        humano.state?.expediente ?? expedienteNumber.value;
      emit("onGetExpediente", humano.state);
    } else {
      alerts.toastAlert(
        "Error al recuperar expediente",
        "warn",
        10,
        "Atención ⚠️"
      );
    }
  } catch (error) {
    alerts.exception(error, 10);
  } finally {
    loading.value = false;
  }
};

const cleanExpediente = () => {
  iconButton.value = "pi pi-check";
  expedienteCargado.value = false;
  expedienteNumber.value = "";
  emit("onCleanExpediente");
  loading.value = false;
  expediente.value.$el.focus();
};
</script>

<template>
  <div class="w-full p-2 bg-blue-100 border rounded-lg dark:bg-zinc-800">
    <div class="grid grid-cols-6 gap-4">
      <div class="col-span-6 sm:col-span-2">
        <label for="expediente" class="labelInput">Nº Expediente</label>
        <InputGroup>
          <InputMask ref="expediente" id="expediente" autocomplete="off" autofocus v-model="expedienteNumber"
            @keydown.enter="getDesarrolloHumano" :readonly="expedienteCargado" mask="999-999999-9999"
            slot-char="000-000000-0000" placeholder="Número de Expediente" pt:root:class="w-full" />

          <Button :icon="iconButton" severity="contrast" outlined @click="onClickButton" :loading="loading" />
        </InputGroup>
      </div>
    </div>
  </div>
</template>
