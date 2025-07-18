import { UnitePedagogique } from "./unite-pedagogique.model";

export interface MyModule {
  id: number;
  codeModule: string;
  libelleModule: string;
  semestre: number;
  coef: number;
   unitePedagogique: {
    id: number;
    libelle: string;
  };
}