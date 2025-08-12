import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyModule } from '../Entity/module.model';
import { Groupe } from '../Entity/Groupe';

export interface AffectationRequestDTO {
  moduleId: number;
  groupeIds: number[];
  periode: string;
}

export interface AffectationModuleGroupe {
  id: number;
  module: {
    idModule: number;
    libelleModule: string;
  };
  groupe: {
    id: number;
    nomClasse: string;
    optionGroupe : string;
    effectif : number;
    departement : string;
    niveau : string;

  };
  periode: string;
}

@Injectable({
  providedIn: 'root'
})
export class AffectationService {
private apiUrl = 'http://localhost:8090/affectations';

  constructor(private http: HttpClient) {}

  affecterModuleAGroupes(request: AffectationRequestDTO): Observable<string> {
    return this.http.post(this.apiUrl + '/affecter', request, { responseType: 'text' });
  }

  getAllAffectations(): Observable<AffectationModuleGroupe[]> {
    return this.http.get<AffectationModuleGroupe[]>(this.apiUrl + '/all');
  }

  deleteAffectation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getModulesByPeriode(periode: string): Observable<MyModule[]> {
    return this.http.get<MyModule[]>(`${this.apiUrl}/modules-by-periode`, {
      params: { periode }
    });
  }

  // Récupérer les groupes par module et période
  getGroupesByModuleAndPeriode(moduleId: number, periode: string): Observable<Groupe[]> {
    return this.http.get<Groupe[]>(`${this.apiUrl}/groupes-by-module-and-periode`, {
      params: {
        moduleId: moduleId.toString(),
        periode
      }
    });
  }
}
