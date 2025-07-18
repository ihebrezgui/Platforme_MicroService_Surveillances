import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { Enseignant } from '../../../Entity/Enseignant';
import { EnseignantService } from '../../../Service/enseignant-service.service';
import { UserServiceService } from '../../../Service/user-service.service';
import { MyModule } from '../../../Entity/module.model';
import { CommonModule } from '@angular/common';
import { UnitePedagogique } from '../../../Entity/unite-pedagogique.model';

@Component({
  selector: 'app-add-enseignant',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-enseignant.component.html',
  styleUrls: ['./add-enseignant.component.scss'],
})
export class AddEnseignantComponent implements OnInit {
  enseignant: Enseignant = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    matricule: '',
    userId: 0,
    moduleId: null as any,



  };

  modules: MyModule[] = [];
  unitePedagogiques: UnitePedagogique[] = [];
  selectedUnitePedagogique: UnitePedagogique | null = null;

  successMessage = '';
  errorMessage = '';
  matriculeInvalide = false;

  constructor(
    private enseignantService: EnseignantService,
    private userService: UserServiceService
  ) {}

  ngOnInit() {
    this.loadUnitePedagogiques();
    this.loadModules();
  }

  loadUnitePedagogiques() {
    this.enseignantService.getAllUnites().subscribe({
      next: (ups) => {
        this.unitePedagogiques = ups;
      },
      error: (err) => console.error('Erreur chargement unités pédagogiques', err),
    });
  }

  loadModules() {
    this.enseignantService.getAllModules().subscribe({
      next: (mods) => {
        this.modules = mods;
      },
      error: (err) => console.error('Erreur lors du chargement des modules', err),
    });
  }

  // Getter pour filtrer les modules selon l’unité pédagogique sélectionnée
  get filteredModules(): MyModule[] {
    if (!this.selectedUnitePedagogique) return this.modules;
    return this.modules.filter(
      (mod) => mod.unitePedagogique?.id === this.selectedUnitePedagogique?.id
    );
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
      this.enseignantService.addEnseignant(this.enseignant).subscribe({
        next: () => {
          this.successMessage = 'Enseignant ajouté avec succès';
          this.errorMessage = '';
          Swal.fire('Succès', this.successMessage, 'success');
          form.resetForm();
          this.resetFormModel();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || "Erreur lors de l'ajout";
          Swal.fire('Erreur', this.errorMessage, 'error');
        },
      });
    } else {
      Swal.fire(
        'Champs invalides',
        'Veuillez remplir correctement tous les champs.',
        'warning'
      );
    }
  }

  resetFormModel() {
    this.enseignant = {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      matricule: '',
      userId: 0,
      moduleId: null as any,

  
    };
    this.selectedUnitePedagogique = null;
    this.matriculeInvalide = false;
    this.successMessage = '';
    this.errorMessage = '';
  }


}
