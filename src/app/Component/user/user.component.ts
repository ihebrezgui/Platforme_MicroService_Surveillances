import { Component, OnInit } from '@angular/core';
import { User } from '../../Entity/User';
import { UserServiceService } from '../../Service/user-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss' 
})
export class UserComponent  {
email = '';
  password = '';
  error = '';

  constructor(private authService: UserServiceService) {}

  onSubmit(): void {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        console.log('Login success:', response);
        localStorage.setItem('token', response.token);
        // redirige l'utilisateur ici si besoin
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.error = 'Identifiants incorrects';
      }
    });
  }
}