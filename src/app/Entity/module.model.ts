import { UnitePedagogique } from "./unite-pedagogique.model";

export type TypeEpreuve = 'DS' | 'EXAMEN';
export type TypeModule = 'PRATIQUE' | 'THEORIQUE';

export interface MyModule {
  id: number;

  codeModule: string;
  libelleModule: string;
 
 

  
   unitePedagogique: {
    id: number;
    libelle: string;
  }; typeEpreuve?: TypeEpreuve;
  typeModule?: TypeModule;
}