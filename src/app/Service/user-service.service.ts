import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../Entity/User';
import { UserDTO } from '../Entity/UserDTO';
import { Router } from '@angular/router';
interface LoginResponse {
  token: string;
  username: string;
  roles: string[];
}
@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
 private baseURL = 'http://localhost:8088/auth'; 

 // ton backend API
   constructor(private httpClient: HttpClient) {}
   
 getUserByMatricule(matricule: string): Observable<any> {
    return this.httpClient.get(`${this.baseURL}/matricule/${matricule}`);
  }

getAllUsers(): Observable<User[]> {
  return this.httpClient.get<User[]>(`${this.baseURL}/all`);
}

  
  login(user: { matricule: string; password: string }): Observable<any> {
    return this.httpClient.post<any>(`${this.baseURL}/login`, user);
  }

register(user: User) {
  return this.httpClient.post(`${this.baseURL}/register`, user);
}



forgotPassword(email: string): Observable<any> {
  return this.httpClient.post(`${this.baseURL}/forgot-password`, { email }, { responseType: 'text' });
}



 resetPassword(token: string, newPassword: string): Observable<string> {
  return this.httpClient.post<string>(`${this.baseURL}/reset-password?token=${token}`, { password: newPassword }, { responseType: 'text' as 'json' });
}


  checkEmailAvailability(email: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseURL}/check-email?email=${email}`);
  }





 private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // méthode pour setter user connecté
  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  

  getAllEnseignants(): Observable<UserDTO[]> {
  return this.httpClient.get<UserDTO[]>(`${this.baseURL}/enseignants`);
}

setUserActiveStatus(id: number, active: boolean): Observable<{ message: string }> {
  return this.httpClient.patch<{ message: string }>(
    `${this.baseURL}/users/${id}/active?active=${active}`,
    null // ou {} si nécessaire
  );
}




}
