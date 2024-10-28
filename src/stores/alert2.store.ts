import { defineStore } from "pinia";
import { default as router } from "../routers/index.ts";
import type { Alert } from "../types/types.primevue.ts";
import type { AxiosError } from "axios";

interface AlertState {
  alerts: Alert[];
  count: number;
  useRandomId: boolean;
}

interface ErrorMessages {
  [key: number]: {
    message: string;
    severity: Alert["severity"];
    seconds?: number;
  };
}

// Constants
const DEFAULT_SUMMARIES: Record<Alert["severity"], string> = {
  success: "Exitoso",
  info: "Información",
  warn: "Atención",
  error: "Error",
};

const ERROR_MESSAGES: ErrorMessages = {
  400: {
    message: "Solicitud incorrecta. Por favor, revise los datos enviados.",
    severity: "error",
  },
  401: {
    message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    severity: "warn",
    seconds: 10,
  },
  403: {
    message: "No tiene permisos para realizar esta acción.",
    severity: "error",
  },
  404: {
    message: "El recurso solicitado no fue encontrado.",
    severity: "warn",
  },
  422: {
    message: "Los datos proporcionados no son válidos.",
    severity: "error",
  },
  429: {
    message: "Demasiadas solicitudes. Por favor, intente más tarde.",
    severity: "warn",
  },
  500: {
    message:
      "Error interno del servidor. Por favor, contacte al administrador.",
    severity: "error",
  },
};

const MAX_ALERTS = 10;
const DEFAULT_LIFE_SECONDS = 3;

export const useAlertStore = defineStore("alert", {
  state: (): AlertState => ({
    alerts: [] as Alert[],
    count: 0,
    useRandomId: false,
  }),

  getters: {
    activeAlerts: (state) => state.alerts.filter((alert) => !alert.read),
    hasActiveAlerts: (state) => state.alerts.some((alert) => !alert.read),
  },

  actions: {
    /**
     * Genera un ID único para cada alerta
     */
    generateAlertId(): string {
      return this.useRandomId
        ? `alert_${Math.random().toString(36).slice(2)}`
        : `alert_${this.count++}`;
    },

    /**
     * Muestra una nueva alerta
     */
    toastAlert(
      msg: string,
      severity: Alert["severity"] = "info",
      seconds: number = DEFAULT_LIFE_SECONDS,
      summary?: string
    ): void {
      if (this.alerts.length >= MAX_ALERTS) {
        this.clear();
      }

      const alert: Alert = {
        id: this.generateAlertId(),
        msg,
        severity,
        summary: summary || DEFAULT_SUMMARIES[severity],
        life: seconds * 1000,
        read: false,
      };

      this.alerts.push(alert);
    },

    /**
     * Marca una alerta como leída
     */
    markAsRead(id: string): void {
      const alert = this.alerts.find((a) => a.id === id);
      if (alert) {
        alert.read = true;
      }
    },

    /**
     * Limpia todas las alertas
     */
    clear(useRandomId: boolean = false): void {
      this.alerts = [];
      this.count = 0;
      this.useRandomId = useRandomId;
    },

    /**
     * Maneja excepciones y muestra alertas apropiadas
     */
    exception(error: unknown, seconds: number = 5): void {
      if (!error) {
        this.toastAlert("Ha ocurrido un error inesperado.", "error", seconds);
        return;
      }

      // Manejo de errores de Axios
      if (this.isAxiosError(error)) {
        const status = error.response?.status ?? 0;
        const errorConfig = ERROR_MESSAGES[status];

        if (errorConfig) {
          this.toastAlert(
            errorConfig.message,
            errorConfig.severity,
            errorConfig.seconds || seconds
          );

          // Redirección especial para error 401
          if (status === 401) {
            router.push("/users/login");
          }
        } else {
          this.toastAlert(`Error de red: ${error.message}`, "error", seconds);
        }

        console.error("Error de API:", {
          status,
          data: error.response?.data,
          message: error.message,
        });
        return;
      }

      // Manejo de otros tipos de error
      if (error instanceof Error) {
        this.toastAlert(`Error: ${error.message}`, "error", seconds);
        console.error("Error no Axios:", error);
        return;
      }

      // Error desconocido
      this.toastAlert("Ha ocurrido un error inesperado.", "error", seconds);
      console.error("Error desconocido:", error);
    },

    /**
     * Type guard para errores de Axios
     */
    isAxiosError(error: unknown): error is AxiosError {
      return (error as AxiosError).isAxiosError === true;
    },
  },
});
