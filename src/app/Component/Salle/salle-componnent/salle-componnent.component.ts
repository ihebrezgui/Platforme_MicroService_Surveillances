import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalleService } from '../../../Service/salle-service.service';
import { CommonModule, NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-salle-componnent',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgFor],
  templateUrl: './salle-componnent.component.html',
  styleUrls: ['./salle-componnent.component.scss']
})
export class SalleComponnentComponent implements OnInit {
  salles: any[] = [];
  isModalOpen = false;
  salleForm!: FormGroup;
  blocsEsprit: string[] = ['A,B,C',  'D', 'E', 'G', 'I,J,K', 'M'];


  isReservationModalOpen = false;
  reservationForm!: FormGroup;
  selectedSalle: any = null;
  reservationErrorMessage: string | null = null;

  constructor(
    private salleService: SalleService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSalles();

   this.salleForm = this.fb.group({
  nom: ['', Validators.required],
  capacite: [1, [Validators.required, Validators.min(1)]],
  bloc: ['', Validators.required],
  etage: [0, [Validators.required, Validators.min(0)]]
});

    this.reservationForm = this.fb.group({
      dateExamen: ['', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      matricule: ['', Validators.required]
    });

    // Reset error on input
    this.reservationForm.valueChanges.subscribe(() => {
      this.reservationErrorMessage = null;
    });
  }

  loadSalles() {
    this.salleService.getAllSalles().subscribe({
      next: (data) => (this.salles = data),
      error: (err) => console.error('Erreur chargement salles', err)
    });
  }

  // ---------- Modal Ajout Salle ----------
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.salleForm.reset({ capacite: 1 });
  }

  onSubmit() {
    if (this.salleForm.invalid) return;

    this.salleService.createSalle(this.salleForm.value).subscribe({
      next: (res) => {
        this.salles.push(res);
        this.closeModal();
      },
      error: (err) => console.error('Erreur création salle', err)
    });
  }

  // ---------- Modal Réservation ----------
  openReservationModal(salle: any) {
    this.selectedSalle = salle;
    this.isReservationModalOpen = true;
  }

  closeReservationModal() {
    this.isReservationModalOpen = false;
    this.selectedSalle = null;
    this.reservationForm.reset();
    this.reservationErrorMessage = null;
  }

  onSubmitReservation() {
    if (this.reservationForm.invalid || !this.selectedSalle) return;

    const formValue = this.reservationForm.value;
    const reservation = {
      dateExamen: formValue.dateExamen,
      heureDebut: formValue.heureDebut,
      heureFin: formValue.heureFin,
      salle: { id: this.selectedSalle.id }
    };

    this.salleService.createReservation(reservation, formValue.matricule).subscribe({
      next: () => {
        alert("✅ Réservation réussie !");
        this.closeReservationModal();
      },
      error: (err) => {
        console.error('Erreur réservation complète:', err);

        if (err.status === 500) {
          this.reservationErrorMessage = "❌ Erreur serveur interne, veuillez réessayer plus tard.";
          return;
        }

        if (err.status === 404) {
          this.reservationErrorMessage = "❌ Enseignant ou salle introuvable.";
          return;
        }

        if (err.status === 409) {
          this.reservationErrorMessage = "❌ Limite de 2 enseignants atteinte pour cette salle à ce créneau.";
          return;
        }

        if (err.status === 400) {
          this.reservationErrorMessage = "❌ " + (err.error?.message || "Requête invalide.");
          return;
        }

        this.reservationErrorMessage = "❌ Une erreur inconnue est survenue.";
      }
    });
  }
}
