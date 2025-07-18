import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserServiceService } from '../../Service/user-service.service';
import { User } from '../../Entity/User';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent  implements OnInit {
  users: User[] = [];

  constructor(private userService: UserServiceService) {}

  ngOnInit(): void {
    this.loadUsers();
  }


toggleUserActive(user: User) {
  const newStatus = !user.active;

  this.userService.setUserActiveStatus(user.id, newStatus).subscribe({
    next: (response) => {
      user.active = newStatus;

      // 💬 Récupère le message dynamique du backend
      const message = response.message || (newStatus ? 'Utilisateur activé' : 'Utilisateur désactivé');

      // ✅ Affiche le message dans une alerte SweetAlert2
      Swal.fire('Succès', message, 'success');
    },
    error: (error) => {
      const errorMessage = error.error?.message || 'Erreur lors du changement de statut';
      Swal.fire('Erreur', errorMessage, 'error');
    }
  });
}



  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Erreur lors du chargement des utilisateurs', err)
    });
  }
}
