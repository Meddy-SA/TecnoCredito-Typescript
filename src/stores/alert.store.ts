import { defineStore } from "pinia";
import { default as router } from '../routers/index.ts'
import type { Alert } from "../types/types.primevue.ts";
import axios, { AxiosError } from 'axios';

interface SummaryMap {
  [key: string]: string;
}

export const useAlertStore = defineStore('alert', {
  state: () => ({
    alerts: [] as Alert[],
    count: 0,
    random: false,
    summaryMap: {
      'success': 'Exitoso',
      'info': 'Información',
      'warn': 'Atención',
      'error': 'Error'
    } as SummaryMap
  }),
  actions: {
    toastAlert(msg: string, severity: 'success' | 'info' | 'warn' | 'error', seconds: number = 3, summary?: string): void {
      if (this.count > 10) {
        this.clear();
      }

      const id = this.random ? `id_${Math.random().toString(36).substring(2)}` : `id_${this.count++}`;
      summary = summary || this.summaryMap[severity] || "Mensaje";
      const life = seconds * 1000;

      this.alerts.push({
        msg,
        severity,
        id,
        read: false,
        summary,
        life
      });
    },

    markAsRead(id: string): void {
      const alertToMark = this.alerts.find(alert => alert.id === id);
      if (alertToMark) {
        alertToMark.read = true;
      }
    },

    clear(random: boolean = false): void {
      this.count = 0;
      this.alerts = [];
      this.random = random;
    },

    exception(error: unknown, seconds: number = 5): void {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        switch (axiosError.response?.status) {
          case 400:
            this.toastAlert('Solicitud incorrecta. Por favor, revise los datos enviados.', 'error', seconds);
            break;
          case 401:
            this.toastAlert('Su sesión ha expirado. Por favor, inicie sesión nuevamente.', 'warn', 10);
            router.push('/users/login');
            break;
          case 403:
            this.toastAlert('No tiene permisos para realizar esta acción.', 'error', seconds);
            break;
          case 404:
            this.toastAlert('El recurso solicitado no fue encontrado.', 'warn', seconds);
            break;
          case 422:
            this.toastAlert('Los datos proporcionados no son válidos.', 'error', seconds);
            break;
          case 429:
            this.toastAlert('Demasiadas solicitudes. Por favor, intente más tarde.', 'warn', seconds);
            break;
          case 500:
            this.toastAlert('Error interno del servidor. Por favor, contacte al administrador.', 'error', seconds);
            break;
          default:
            this.toastAlert(`Error de red: ${axiosError.message}`, 'error', seconds);
        }

        // Log del error para debugging
        console.error('Error de API:', axiosError.response?.data);
      } else if (error instanceof Error) {
        // Manejo de errores que no son de Axios
        this.toastAlert(`Error: ${error.message}`, 'error', seconds);
        console.error('Error no Axios:', error);
      } else {
        // Manejo de errores desconocidos
        this.toastAlert('Ha ocurrido un error inesperado.', 'error', seconds);
        console.error('Error desconocido:', error);
      }

    }
  }
});
