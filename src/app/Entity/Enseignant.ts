import { MyModule } from "./module.model";


export interface Enseignant {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  matricule: string;
  userId: number;
  role?: string;
  myModule?: MyModule; // relation au module
  moduleId?: number;
  moduleLibelle?: string;
  unitePedagogiqueLibelle?: string;  
}
