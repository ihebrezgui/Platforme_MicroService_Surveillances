import { Component, OnInit } from '@angular/core';
import { Enseignant } from '../../../Entity/Enseignant';
import { EnseignantService } from '../../../Service/enseignant-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnitePedagogique } from '../../../Entity/unite-pedagogique.model';

@Component({
  selector: 'app-enseignant',
  templateUrl: './enseignant.component.html',
  styleUrls: ['./enseignant.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class EnseignantComponent implements OnInit {
  enseignants: Enseignant[] = [];
  filteredEnseignants: Enseignant[] = [];
  unitePedagogiques: UnitePedagogique[] = [];
  loading: boolean = true;
  role: string = ''; // récupérer depuis le token/session
  searchTerm: string = '';
  
  // Filter properties
  gradeFilter: string = 'all';
  statutFilter: string = 'all';
  uniteFilter: string = 'all';
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 15;

  constructor(
    private enseignantService: EnseignantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupération du rôle depuis localStorage ou service
    this.role = localStorage.getItem('role') || '';
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading = true;
    try {
      await Promise.all([
        this.loadUnitePedagogiques(),
        this.loadEnseignants()
      ]);
      // Appliquer les filtres après le chargement des données
      this.applyFilters();
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      this.loading = false;
    }
  }

  loadUnitePedagogiques(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.enseignantService.getAllUnites().subscribe({
        next: (data) => {
          this.unitePedagogiques = data;
          resolve();
        },
        error: (err) => {
          console.error('Erreur chargement unités pédagogiques:', err);
          reject(err);
        }
      });
    });
  }

  loadEnseignants(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.enseignantService.getAllEnseignants().subscribe({
        next: (data) => {
          this.enseignants = data;
          this.filteredEnseignants = [...this.enseignants];
          resolve();
        },
        error: (err) => {
          console.error('Erreur chargement enseignants:', err);
          reject(err);
        }
      });
    });
  }

  // Search functionality
  onSearchChange(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  // Filter functionality
  onGradeFilterChange(grade: string): void {
    this.gradeFilter = grade;
    this.applyFilters();
  }

  onStatutFilterChange(statut: string): void {
    this.statutFilter = statut;
    this.applyFilters();
  }

  onUniteFilterChange(unite: string): void {
    this.uniteFilter = unite;
    this.applyFilters();
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.gradeFilter = 'all';
    this.statutFilter = 'all';
    this.uniteFilter = 'all';
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.enseignants];

    // Si l'utilisateur est ENSEIGNANT, ne montrer que sa propre ligne
    if (this.role === 'ENSEIGNANT') {
      const currentMatricule = localStorage.getItem('matricule') || '';
      filtered = filtered.filter(e => e.matricule === currentMatricule);
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(ens => 
        ens.nom?.toLowerCase().includes(term) ||
        ens.prenom?.toLowerCase().includes(term) ||
        ens.email?.toLowerCase().includes(term) ||
        ens.matricule?.toLowerCase().includes(term) ||
        ens.grade?.toLowerCase().includes(term)
      );
    }

    // Apply grade filter
    if (this.gradeFilter !== 'all') {
      filtered = filtered.filter(ens => ens.grade === this.gradeFilter);
    }

    // Apply statut filter
    if (this.statutFilter !== 'all') {
      filtered = filtered.filter(ens => ens.statut === this.statutFilter);
    }

    // Apply unite filter
    if (this.uniteFilter !== 'all') {
      filtered = filtered.filter(ens => ens.unitePedagogique?.id?.toString() === this.uniteFilter);
    }

    this.filteredEnseignants = filtered;
    this.currentPage = 1; // Reset to first page when filtering
  }

  // Helper methods for filter counts
  getGradeCount(grade: string): number {
    return this.enseignants.filter(ens => ens.grade === grade).length;
  }

  getStatutCount(statut: string): number {
    return this.enseignants.filter(ens => ens.statut === statut).length;
  }

  getUniteCount(uniteId: string): number {
    return this.enseignants.filter(ens => ens.unitePedagogique?.id?.toString() === uniteId).length;
  }

  // Pagination methods
  getPaginatedEnseignants(): Enseignant[] {
    // Si l'utilisateur n'est pas ADMIN ou SUPER_ADMIN, retourner tous les enseignants
    if (this.role !== 'ADMIN' && this.role !== 'SUPER_ADMIN') {
      return this.filteredEnseignants;
    }
    
    const startIndex = this.getStartIndex();
    const endIndex = this.getEndIndex();
    return this.filteredEnseignants.slice(startIndex, endIndex);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  getEndIndex(): number {
    return Math.min(this.getStartIndex() + this.itemsPerPage, this.filteredEnseignants.length);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredEnseignants.length / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const currentPage = this.currentPage;
    const pageNumbers: number[] = [];

    if (totalPages <= 7) {
      // If total pages is 7 or less, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      if (currentPage > 4) {
        pageNumbers.push(-1); // Ellipsis
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pageNumbers.push(i);
        }
      }

      if (currentPage < totalPages - 3) {
        pageNumbers.push(-1); // Ellipsis
      }

      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
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

  // Track by function for ngFor
  trackByEnseignantId(index: number, enseignant: Enseignant): number {
    return enseignant.id || index;
  }

  // Helper method for user initials
  getInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getLibelleUnitePedagogique(id?: number): string {
    if (!id) return 'Unité non assignée';
    const unite = this.unitePedagogiques.find(u => u.id === id);
    return unite?.libelle || 'Unité non assignée';
  }

  getGradeLibelle(grade?: string): string {
    switch (grade) {
      case 'CUP': return 'Chargé d\'UP';
      case 'EFA': return 'Formateur Associé';
      case 'EF': return 'Enseignant Formateur';
      case 'CHEFDEP': return 'Chef de Département';
      default: return 'Non défini';
    }
  }

  getGradeIcon(grade?: string): string {
    switch (grade) {
      case 'CUP': return '👨‍💼';
      case 'EFA': return '👨‍🏫';
      case 'EF': return '🎓';
      case 'CHEFDEP': return '👑';
      default: return '❓';
    }
  }

  getStatutLibelle(statut?: string): string {
    switch (statut) {
      case 'PERMANENT': return 'Permanent';
      case 'VACATAIRE': return 'Vacataire';
      default: return 'Non défini';
    }
  }

  getStatutIcon(statut?: string): string {
    switch (statut) {
      case 'PERMANENT': return '🏢';
      case 'VACATAIRE': return '📋';
      default: return '❓';
    }
  }

  navigateToAddEnseignant(): void {
    if (this.role !== 'SUPER_ADMIN') return; // seul SUPER_ADMIN peut ajouter
    this.router.navigate(['/addenseignant']);
  }

  navigateToUpdateEnseignant(id?: number): void {
    if (!id) return;
    if (this.role === 'ENSEIGNANT') return; // enseignant ne peut modifier
    this.router.navigate(['/update-enseignant', id]);
  }

  deleteEnseignant(id?: number): void {
    if (!id) return;
    if (this.role !== 'SUPER_ADMIN') return; // seul SUPER_ADMIN peut supprimer
    
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action ne peut pas être annulée !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.enseignantService.deleteEnseignant(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Supprimé !',
              text: 'L\'enseignant a été supprimé avec succès.',
              icon: 'success',
              confirmButtonColor: '#10b981'
            });
            this.loadEnseignants();
          },
          error: (err) => {
            Swal.fire({
              title: 'Erreur !',
              text: err.error?.message || 'Échec de la suppression',
              icon: 'error',
              confirmButtonColor: '#ef4444'
            });
          }
        });
      }
    });
  }

  canEdit(): boolean {
    return this.role === 'SUPER_ADMIN' || this.role === 'ADMIN';
  }

  canDelete(): boolean {
    return this.role === 'SUPER_ADMIN';
  }

  canAdd(): boolean {
    return this.role === 'SUPER_ADMIN';
  }
}
