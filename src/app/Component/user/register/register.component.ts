import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { User } from '../../../Entity/User';
import { UserServiceService } from '../../../Service/user-service.service';



@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'

})
export class RegisterComponent {
  user: User = new User();

  constructor(private authService: UserServiceService) {}

  onRegister(): void {
    const username = this.user.username?.trim() || '';
    const email = this.user.email?.trim() || '';
    const password = this.user.password || '';
    const role = this.user.role;
    const matricule = this.user.matricule?.trim() || '';

    if (
      username.length < 3 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      password.length < 6 ||
      !role ||
      matricule.length < 3
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Champs manquants ou invalides',
        text: 'Veuillez remplir correctement tous les champs requis.',
        confirmButtonColor: '#dc3545',
      });
      return;
    }

    this.authService.register(this.user).subscribe({
      next: () => {
        Swal.fire('Succès', 'Inscription réussie. Vous pouvez vous connecter.', 'success');
        this.user = new User(); // reset formulaire après succès
      },
      error: () => {
        Swal.fire('Erreur', 'L\'inscription a échoué.', 'error');
      }
    });
  }
}
