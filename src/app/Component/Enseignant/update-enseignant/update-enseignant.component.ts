import { Component, OnInit } from '@angular/core';
import { Enseignant } from '../../../Entity/Enseignant';
import { MyModule } from '../../../Entity/module.model';
import { UnitePedagogique } from '../../../Entity/unite-pedagogique.model';
import { ActivatedRoute, Router } from '@angular/router';
import { EnseignantService } from '../../../Service/enseignant-service.service';
import { UserServiceService } from '../../../Service/user-service.service';
import Swal from 'sweetalert2';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-enseignant',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update-enseignant.component.html',
  styleUrl: './update-enseignant.component.scss'
})
export class UpdateEnseignantComponent implements OnInit {
    enseignant: Enseignant = {
    id: 0,
    nom: '',
    email: '',
    telephone: '',
    matricule: '',
    userId: 0,
    grade: null as any,
      unitePedagogique: undefined, // <-- ici
  };
  isSubmitting: boolean = false;

  gradeOptions: string[] = ['CUP', 'EFA', 'EF', 'CHEFDEP'];
  statutOptions: string[] = ['PERMANENT', 'VACATAIRE'];
  unitePedagogiques: UnitePedagogique[] = [];
selectedUnitePedagogiqueId: number = 0; // valeur par défaut = 0 (ou un id valide)

  matriculeInvalide = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private enseignantService: EnseignantService,
    private userService: UserServiceService,
    private router: Router
  ) {}

  
  loadUnitePedagogiques() {
  this.enseignantService.getAllUnites().subscribe({
    next: (ups) => {
      this.unitePedagogiques = ups;
      console.log('Unités pédagogiques chargées :', this.unitePedagogiques);
    },
    error: (err) => {
      console.error('Erreur chargement unités pédagogiques', err);
    },
  });
}


 

  onMatriculeInput(matricule: string) {
    if (!matricule || matricule.trim() === '') {
      this.matriculeInvalide = false;
      this.enseignant.userId = 0;
      return;
    }
    this.userService.getUserByMatricule(matricule).subscribe({
      next: (user) => {
        this.enseignant.userId = user.id;
        this.matriculeInvalide = false;
      },
      error: () => {
        this.enseignant.userId = 0;
        this.matriculeInvalide = true;
      },
    });
  }

  onSubmit(form: NgForm) {
    if (form.valid && !this.matriculeInvalide) {
      this.isSubmitting = true;
      
      this.enseignantService
        .updateEnseignant(this.enseignant.id!, this.enseignant)
        .subscribe({
          next: () => {
            this.successMessage = 'Enseignant mis à jour avec succès';
            this.errorMessage = '';
            Swal.fire({
              icon: 'success',
              title: 'Succès!',
              text: this.successMessage,
              confirmButtonColor: '#2563eb'
            });
            this.router.navigate(['/enseignants']);
          },
          error: (err) => {
            this.errorMessage = err.error?.message || "Erreur lors de la mise à jour";
            Swal.fire({
              icon: 'error',
              title: 'Erreur!',
              text: this.errorMessage,
              confirmButtonColor: '#ef4444'
            });
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Champs invalides',
        text: 'Veuillez remplir correctement tous les champs.',
        confirmButtonColor: '#f59e0b'
      });
    }
  }
ngOnInit() {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  this.loadUnitePedagogiques();

  if (id) {
    this.loadEnseignant(id);
  }
  console.log('🎓 Enseignant chargé :', this.enseignant);

}

loadEnseignant(id: number) {
  this.enseignantService.getEnseignantById(id).subscribe({
    next: (ens) => {
      this.enseignant = ens;
this.selectedUnitePedagogiqueId = ens.unitePedagogique ? ens.unitePedagogique.id : 0;

      if (ens.matricule) {
        this.onMatriculeInput(ens.matricule);
      }
    },
    error: (err) => {
      this.errorMessage = "Erreur chargement de l'enseignant";
      console.error(err);
    }
  });
}

  onUniteChange(event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  const selectedValue = Number(selectElement.value);
  console.log('✅ Changement unité sélectionnée :', selectedValue);

  // Vérifie si enseignant existe
  if (!this.enseignant) {
    console.error('❌ this.enseignant est NULL ou UNDEFINED');
    return;
  }

  // Vérifie l'état initial de unitePedagogique
  console.log('📦 État avant modification:', this.enseignant.unitePedagogique);

  // Affectation sécurisée
  if (this.enseignant.unitePedagogique) {
    console.log('🛠 Affectation directe à enseignant.unitePedagogique.id');
    this.enseignant.unitePedagogique.id = selectedValue;
  } else {
    console.warn('⚠️ unitePedagogique est null, on initialise un nouvel objet');
    this.enseignant.unitePedagogique = { id: selectedValue } as any;
  }

  // Vérifie après affectation
  console.log('✅ État après modification:', this.enseignant.unitePedagogique);
}

  navigateToEnseignants(): void {
    this.router.navigate(['/enseignants']);
  }

}
