import { EnseignantService } from './../../Service/enseignant-service.service';
import { Component } from '@angular/core';
import { MyModule, TypeEpreuve, TypeModule } from '../../Entity/module.model';
import { ModuleServiceService } from '../../Service/module-service.service';
import { UnitePedagogique } from '../../Entity/unite-pedagogique.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-module-manager',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './module-manager.component.html',
  styleUrl: './module-manager.component.scss'
})
export class ModuleManagerComponent {
  modules: MyModule[] = [];
  unites: UnitePedagogique[] = [];
  filteredModules: MyModule[] = [];
  selectedUniteId: number = 0;
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 15;
  
  // Role management
  role: string = 'ADMIN'; // This should be set from your auth service
  
  newModule: MyModule = {
    id: 0,
    codeModule: '',
    libelleModule: '',
    unitePedagogique: {
      id: 0,
      libelle: ''
    }
  };
  
  selectedFile: File | null = null;
  message = '';
  showAddForm = false;
  showImportSection = false;
  
  constructor(
    private moduleService: ModuleServiceService, 
    private enseignantService: EnseignantService
  ) {}

  ngOnInit(): void {
    this.loadModules();
    this.loadUnites();
    // TODO: Set role from your auth service
    // this.role = this.authService.getRole();
  }

  loadModules(): void {
    this.moduleService.getAll().subscribe({
      next: (data) => {
        this.modules = data;
        this.filteredModules = data;
        this.currentPage = 1; // Reset to first page when data loads
      },
      error: (err) => console.error(err),
    });
  }

  loadUnites(): void {
    this.enseignantService.getAllUnites().subscribe({
      next: (data) => (this.unites = data),
      error: (err) => console.error(err),
    });
  }

  filterModulesByUnite(uniteId: number): void {
    this.selectedUniteId = uniteId;
    if (uniteId === 0) {
      this.filteredModules = this.modules;
    } else {
      this.filteredModules = this.modules.filter(m => m.unitePedagogique.id === uniteId);
    }
    this.currentPage = 1; // Reset to first page when filtering
  }

  // Pagination methods
  getPaginatedModules(): MyModule[] {
    const startIndex = this.getStartIndex();
    const endIndex = this.getEndIndex();
    return this.filteredModules.slice(startIndex, endIndex);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  getEndIndex(): number {
    return Math.min(this.getStartIndex() + this.itemsPerPage, this.filteredModules.length);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredModules.length / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const currentPage = this.currentPage;
    const pages: number[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      }
    }

    return pages;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  openAddForm(): void {
    this.showAddForm = true;
    this.resetForm();
  }

  closeAddForm(): void {
    this.showAddForm = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newModule = {
      id: 0,
      codeModule: '',
      libelleModule: '',
      typeEpreuve: undefined,
      typeModule: undefined,
      unitePedagogique: {
        id: 0,
        libelle: ''
      }
    };
  }

  createModule(): void {
    if (
      !this.newModule.codeModule ||
      !this.newModule.libelleModule ||
      !this.newModule.unitePedagogique?.id
    ) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    // Préparer le payload en excluant les champs non supportés par le backend (temporaire)
    const modulePayload: any = {
      codeModule: this.newModule.codeModule,
      libelleModule: this.newModule.libelleModule,
      unitePedagogique: this.newModule.unitePedagogique
    };

    // Ajouter les nouveaux champs seulement s'ils sont définis
    if (this.newModule.typeEpreuve) {
      modulePayload.typeEpreuve = this.newModule.typeEpreuve;
    }
    if (this.newModule.typeModule) {
      modulePayload.typeModule = this.newModule.typeModule;
    }

    this.moduleService.create(modulePayload).subscribe({
      next: () => {
        this.loadModules();
        this.closeAddForm();
        Swal.fire({
          title: 'Succès!',
          text: 'Module ajouté avec succès',
          icon: 'success',
          confirmButtonColor: '#10b981',
          timer: 2000,
          timerProgressBar: true
        });
      },
      error: (err) => {
        console.error('Erreur détaillée:', err);
        Swal.fire({
          title: 'Erreur',
          text: err.error?.message || 'Erreur lors de l\'ajout du module. Vérifiez que le backend supporte les nouveaux champs.',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  deleteModule(id: number): void {
    if (this.role !== 'ADMIN' && this.role !== 'SUPER_ADMIN') return; // seule admin et super admin peuvent supprimer

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
        this.moduleService.delete(id).subscribe({
          next: () => {
            this.loadModules();
            Swal.fire({
              title: 'Supprimé !',
              text: 'Module supprimé avec succès',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              timerProgressBar: true
            });
          },
          error: (err) => {
            console.error(err);
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

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }

  importExcel(): void {
    if (!this.selectedFile) {
      alert('Veuillez sélectionner un fichier Excel');
      return;
    }
    
    this.moduleService.importExcel(this.selectedFile!).subscribe({
      next: (importedModules) => {
        this.message = `Import réussi: ${importedModules.length} modules ajoutés.`;
        this.loadModules();
        this.selectedFile = null;
        setTimeout(() => this.message = '', 5000);
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.message = err.error.message;
        } else {
          this.message = 'Erreur lors de l\'import.';
        }
        console.error(err);
      }
    });
  }

  toggleImportSection(): void {
    this.showImportSection = !this.showImportSection;
  }

  getModuleCountByUnite(uniteId: number): number {
    return this.modules.filter(m => m.unitePedagogique.id === uniteId).length;
  }

  trackByModuleId(index: number, module: MyModule): number {
    return module.id || index;
  }

  // Utility method for badge classes
  getTypeBadgeClass(type: TypeEpreuve | TypeModule | undefined, category: 'epreuve' | 'module'): string {
    if (!type) return '';
    
    if (category === 'epreuve') {
      return type === 'DS' ? 'badge-ds' : 'badge-examen';
    } else {
      return type === 'PRATIQUE' ? 'badge-pratique' : 'badge-theorique';
    }
  }
}