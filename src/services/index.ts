// Service/index.ts
import alfabetaController from './alfabeta';
import authenticationController from './authentication';
import humanoController from './humano';
import prestadorController from './prestadores';
import systemController from './system';

export const API = {
  alfabeta: alfabetaController,
  authentication: authenticationController,
  humano: humanoController,
  prestador: prestadorController,
  system: systemController,
}

