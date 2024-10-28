// Service/index.ts
import { authenticationAPIController } from "./authentication";
import { categoryAPIController } from "./category";
import { enumeratorAPIController } from "./enumerator";
import { productAPIController } from "./product";
import { systemAPIController } from "./system";

export const API = {
  auth: authenticationAPIController(),
  category: categoryAPIController(),
  product: productAPIController(),
  status: enumeratorAPIController(),
  system: systemAPIController(),
};
