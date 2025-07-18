import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Enseignant } from '../Entity/Enseignant';
import { MyModule } from '../Entity/module.model';
import { UnitePedagogique } from '../Entity/unite-pedagogique.model';



@Injectable({
  providedIn: 'root'
})
export class EnseignantService {

  private baseUrl = 'http://localhost:8090/ensignat';

  constructor(private http: HttpClient) { }



  getAllUnites(): Observable<UnitePedagogique[]> {
    return this.http.get<UnitePedagogique[]>(`${this.baseUrl}/unite-pedagogiques`);
  }
  getAllEnseignants(): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>(`${this.baseUrl}/getAllEnseignants`);
  }
  addEnseignant(enseignant: Enseignant): Observable<Enseignant> {
    return this.http.post<Enseignant>(`${this.baseUrl}/addEnsignat`, enseignant);
  }

   getEnseignantById(id: number): Observable<Enseignant> {
    return this.http.get<Enseignant>(`${this.baseUrl}/id/${id}`);
  }


    getAllModules(): Observable<MyModule[]> {
    return this.http.get<MyModule[]>(`${this.baseUrl}/modules`);
  }
}
