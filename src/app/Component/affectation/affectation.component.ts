import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AffectationModuleGroupe, AffectationRequestDTO, AffectationService } from './../../Service/affectation-service.service';
import { EmploiDuTempsService } from './../../Service/emploi-du-temps.service';
import { EnseignantService } from './../../Service/enseignant-service.service';
import { Groupe } from '../../Entity/Groupe';




@Component({
  selector: 'app-affectation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './affectation.component.html',
  styleUrls: ['./affectation.component.scss']
})
export class AffectationComponent implements OnInit {
  modules: any[] = [];

  groupes: Groupe[] = [];
  filteredGroupes: Groupe[] = [];

  affectations: AffectationModuleGroupe[] = [];

  selectedModuleId: number | null = null;

  optionsGroupe: string[] = [];
  selectedOptionGroupe: string | null = null;

  selectedGroupeIds: number[] = [];
  selectedPeriode: string = 'PERIODE_1';
  isLoading: boolean = false;

  periodes = ['PERIODE_1', 'PERIODE_2', 'PERIODE_3', 'PERIODE_4'];

  constructor(
    private affectationService: AffectationService,
    private EmploiDuTempsService: EmploiDuTempsService,
    private EnseignantService: EnseignantService
  ) {}

  ngOnInit(): void {
    this.loadModules();
    this.loadGroupes();
    this.loadAffectations();
  }



  loadModules() {
    this.EnseignantService.getAllModules().subscribe(data => {
      this.modules = data;
      console.log("Modules chargés:", this.modules);
    });
  }

  loadGroupes() {
    this.EmploiDuTempsService.getAllGroupes().subscribe(data => {
      this.groupes = data;

      // Extraire les options uniques
      this.optionsGroupe = Array.from(new Set(this.groupes.map(g => g.optionGroupe)));

      this.selectedOptionGroupe = this.optionsGroupe.length > 0 ? this.optionsGroupe[0] : null;

      this.filterGroupes();
    });
  }

  filterGroupes() {
    if (this.selectedOptionGroupe) {
      this.filteredGroupes = this.groupes.filter(g => g.optionGroupe === this.selectedOptionGroupe);
    } else {
      this.filteredGroupes = [...this.groupes];
    }
    this.selectedGroupeIds = [];
  }
getDisplayClassName(groupe: Groupe): string {
  return `${groupe.niveau}${groupe.optionGroupe}${groupe.nomClasse}`;
}


onOptionGroupeChange(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  this.selectedOptionGroupe = selectElement.value;
  this.filterGroupes();
  
}


  affecter() {
    console.log('selectedModuleId:', this.selectedModuleId);
    console.log('selectedGroupeIds:', this.selectedGroupeIds);
    console.log('selectedPeriode:', this.selectedPeriode);

    if (!this.isFormValid()) {
      Swal.fire({
        title: 'Attention',
        text: 'Veuillez sélectionner un module, au moins un groupe, et une période.',
        icon: 'warning',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    this.isLoading = true;

    const request: AffectationRequestDTO = {
      moduleId: this.selectedModuleId!,
      groupeIds: this.selectedGroupeIds,
      periode: this.selectedPeriode
    };

    this.affectationService.affecterModuleAGroupes(request).subscribe({
      next: res => {
        this.isLoading = false;
        Swal.fire({
          title: 'Succès!',
          text: res || 'Module affecté avec succès',
          icon: 'success',
          confirmButtonColor: '#10b981',
          timer: 2000,
          timerProgressBar: true
        });
        this.loadAffectations();
        this.clearSelection();
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Erreur',
          text: err.error?.message || 'Une erreur est survenue lors de l\'affectation',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  loadAffectations() {
    this.affectationService.getAllAffectations().subscribe(data => {
      this.affectations = data;
    });
  }

  deleteAffectation(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.affectationService.deleteAffectation(id).subscribe({
          next: () => {
            this.loadAffectations();
            Swal.fire({
              title: 'Supprimé !',
              text: 'Affectation supprimée avec succès',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              timerProgressBar: true
            });
          },
          error: (err) => {
            Swal.fire({
              title: 'Erreur',
              text: err.error?.message || 'Échec de la suppression',
              icon: 'error',
              confirmButtonColor: '#ef4444'
            });
          }
        });
      }
    });
  }

  // Helper methods for the improved form
  getSelectedModuleName(): string {
    const module = this.modules.find(m => m.id === this.selectedModuleId);
    return module ? module.libelleModule : '';
  }

  getPeriodeDisplayName(periode: string): string {
    const periodeMap: { [key: string]: string } = {
      'PERIODE_1': 'Période 1 (Semestre 1)',
      'PERIODE_2': 'Période 2 (Semestre 1)', 
      'PERIODE_3': 'Période 3 (Semestre 2)',
      'PERIODE_4': 'Période 4 (Semestre 2)'
    };
    return periodeMap[periode] || periode;
  }

  isFormValid(): boolean {
    return !!(this.selectedModuleId && this.selectedPeriode && this.selectedGroupeIds.length > 0);
  }

  selectAllClasses(): void {
    this.selectedGroupeIds = this.filteredGroupes.map(g => g.id!);
  }

  clearSelection(): void {
    this.selectedGroupeIds = [];
  }
}
