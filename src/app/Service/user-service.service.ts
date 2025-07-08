import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../Entity/User';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private baseURL = 'http://localhost:8088/auth';

  constructor(private httpClient: HttpClient) {}
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.httpClient.post(`${this.baseURL}/login`, credentials);
  }

  register(user: User): Observable<any> {
    return this.httpClient.post(`${this.baseURL}/register`, user, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  forgotPassword(email: string): Observable<string> {
    return this.httpClient.post<string>(`${this.baseURL}/forgot-password`, { email }, { responseType: 'text' as 'json' });
  }

  resetPassword(token: string, newPassword: string): Observable<string> {
    return this.httpClient.post<string>(`${this.baseURL}/reset-password?token=${token}`, { password: newPassword }, { responseType: 'text' as 'json' });
  }

  checkEmailAvailability(email: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseURL}/check-email?email=${email}`);
  }
}
