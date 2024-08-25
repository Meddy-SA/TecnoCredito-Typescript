import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import "./style.css";
import MyPreset from "./config/myPreset";
import "primeicons/primeicons.css";
import "boxicons";

// get middlewares
import routers from "./routers";
import { localeOptions } from "./locales/primevue-locale";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import Tooltip from "primevue/tooltip";
import FocusTrap from "primevue/focustrap";
import Ripple from "primevue/ripple";
import StyleClass from "primevue/styleclass";
import BadgeDirective from "primevue/badgedirective";
import AnimateOnScroll from "primevue/animateonscroll";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(routers);

// PrimeVUE
app.use(PrimeVue, {
  ripple: true,
  locale: localeOptions,
  theme: {
    preset: MyPreset,
    options: {
      prefix: "p",
      darkModeSelector: ".my-app-dark",
      cssLayer: false,
    },
  },
});

// Directivas
app.use(ToastService);
app.use(ConfirmationService);
app.directive("tooltip", Tooltip);
app.directive("focustrap", FocusTrap);
app.directive("ripple", Ripple);
app.directive("styleclass", StyleClass);
app.directive("badge", BadgeDirective);
app.directive("animateonscroll", AnimateOnScroll);

app.mount("#app");
