// Service/index.ts
import authenticationController from "./authentication";
import productController from "./product";
import systemController from "./system";

export const API = {
  authentication: authenticationController,
  product: productController,
  system: systemController,
};
