import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salle } from '../Entity/Salle';


@Injectable({
  providedIn: 'root'
})
export class SalleService {
  private baseUrl = 'http://localhost:8093/salles';

  constructor(private http: HttpClient) {}

  getAllSalles(): Observable<Salle[]> {
    return this.http.get<Salle[]>(`${this.baseUrl}`);
  }




  createSalle(salle: Salle): Observable<Salle> {
    return this.http.post<Salle>(this.baseUrl, salle);
  }

  createReservation(reservation: any, matricule: string) {
  return this.http.post(`http://localhost:8093/reservations/${matricule}`, reservation)

}

}
