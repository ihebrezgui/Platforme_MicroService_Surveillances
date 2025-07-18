import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EmploiDuTempsService, EmploiDuTemps, Salle, Groupe } from '../../../Service/emploi-du-temps.service';
import { SalleService } from '../../../Service/salle-service.service';
import { EnseignantService } from '../../../Service/enseignant-service.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-emploi-du-temp',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-emploi-du-temp.component.html',
  styleUrls: ['./add-emploi-du-temp.component.scss']
})
export class AddEmploiDuTempComponent implements OnInit {
  emploiForm!: FormGroup;
  salles: Salle[] = [];
  groupes: Groupe[] = [];
  typeActivites: string[] = ['Examen', 'Cours', 'TD', 'TP'];

  enseignantId!: number;
  enseignantNom: string = '';
  enseignantMatricule: string = '';

  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private salleService: SalleService,
    private enseignantService: EnseignantService,
    private emploiService: EmploiDuTempsService
  ) {}

  ngOnInit(): void {
    this.enseignantId = Number(this.route.snapshot.params['id']);

    this.emploiForm = this.fb.group({
      date: ['', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      salleId: ['', Validators.required],
      typeActivite: ['', Validators.required],
      groupeId: ['', Validators.required]
    });

    this.salleService.getAllSalles().subscribe(data => (this.salles = data));
    this.emploiService.getAllGroupes().subscribe(data => (this.groupes = data));

    this.enseignantService.getEnseignantById(this.enseignantId).subscribe(data => {
      this.enseignantNom = `${data.nom} ${data.prenom}`;
      this.enseignantMatricule = data.matricule;
    });
  }

  onSubmit(): void {
    if (this.emploiForm.valid) {
      const formValue = this.emploiForm.value;

      const selectedSalle = this.salles.find(s => s.id == formValue.salleId);
      const selectedGroupe = this.groupes.find(g => g.id == formValue.groupeId);

      const newEmploi: EmploiDuTemps = {
        enseignantId: this.enseignantId,
        date: formValue.date,
        heureDebut: formValue.heureDebut,
        heureFin: formValue.heureFin,
        typeActivite: formValue.typeActivite,
        salle: selectedSalle ? selectedSalle.nom : '',
        groupeId: selectedGroupe ? selectedGroupe.id : 0
      };

      this.emploiService.create(newEmploi).subscribe({
        next: () => {
          this.successMessage = 'Emploi du temps ajouté avec succès.';
          this.errorMessage = '';
          this.emploiForm.reset();
          this.router.navigate(['/Calendrier_enseignant', this.enseignantId]);
        },
        error: err => {
          console.error(err);
          this.successMessage = '';
          this.errorMessage = "Erreur lors de l'ajout de l'emploi du temps.";
        }
      });
    } else {
      this.successMessage = '';
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
    }
  }
}
