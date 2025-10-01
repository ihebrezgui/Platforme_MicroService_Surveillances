import { Component, OnInit } from '@angular/core';
import { Groupe } from '../../Entity/Groupe';
import { ModuleServiceService } from '../../Service/module-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-groupe-manager',
  imports: [CommonModule , ReactiveFormsModule,FormsModule],
  templateUrl: './groupe-manager.component.html',
  styleUrl: './groupe-manager.component.scss'
})
export class GroupeManagerComponent implements OnInit {
  groupes: Groupe[] = [];
  groupeForm: Groupe = {
    nomClasse: '',
    niveau: '',
    optionGroupe: '',
    effectif: 0,
    departement: ''
  };
  isEditing = false;
  showForm = false;

  // Filter properties
  searchTerm: string = '';
  optionFilter: string = 'all';
  filteredGroupes: Groupe[] = [];

  constructor(private groupeService: ModuleServiceService) {}

  ngOnInit(): void {
    this.loadGroupes();
  }

  loadGroupes(): void {
    this.groupeService.getAllGroupes().subscribe(data => {
      this.groupes = data;
      this.applyFilters();
    });
  }

  // Filter methods
  onSearchChange(): void {
    this.applyFilters();
  }

  onOptionFilterChange(option: string): void {
    this.optionFilter = option;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.optionFilter = 'all';
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.groupes];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(groupe => 
        this.getDisplayClassName(groupe).toLowerCase().includes(searchLower) ||
        groupe.niveau.toLowerCase().includes(searchLower) ||
        groupe.departement.toLowerCase().includes(searchLower)
      );
    }

    // Apply option filter
    if (this.optionFilter !== 'all') {
      filtered = filtered.filter(groupe => groupe.optionGroupe === this.optionFilter);
    }

    this.filteredGroupes = filtered;
  }

  get filteredOptionKeys(): string[] {
    if (this.optionFilter === 'all') {
      return this.optionKeys.filter(option => 
        this.getFilteredGroupesForOption(option).length > 0
      );
    } else {
      return this.optionFilter ? [this.optionFilter] : [];
    }
  }

  getFilteredGroupesForOption(option: string): Groupe[] {
    return this.filteredGroupes.filter(groupe => groupe.optionGroupe === option);
  }

  // Generate the display name by concatenating niveau + option + nomClasse
  getDisplayClassName(groupe: Groupe): string {
    return `${groupe.niveau}${groupe.optionGroupe}${groupe.nomClasse}`;
  }

  saveGroupe(): void {
    if (this.isEditing && this.groupeForm.id) {
      this.groupeService.updateGroupe(this.groupeForm.id, this.groupeForm).subscribe(() => {
        this.loadGroupes();
        this.resetForm();
      });
    } else {
      this.groupeService.createGroupe(this.groupeForm).subscribe(() => {
        this.loadGroupes();
        this.resetForm();
      });
    }
  }

  editGroupe(groupe: Groupe): void {
    this.groupeForm = { ...groupe };
    this.isEditing = true;
    this.showForm = true;
  }

  deleteGroupe(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce groupe ?')) {
      this.groupeService.deleteGroupe(id).subscribe(() => this.loadGroupes());
    }
  }

  resetForm(): void {
    this.groupeForm = {
      nomClasse: '',
      niveau: '',
      optionGroupe: '',
      effectif: 0,
      departement: ''
    };
    this.isEditing = false;
    this.showForm = false;
  }

  openAddForm(): void {
    this.resetForm();
    this.showForm = true;
  }

  closeForm(): void {
    this.resetForm();
  }

  trackByGroupeId(index: number, groupe: Groupe): any {
    return groupe.id || index;
  }

  // Group groupes by option
  get groupedGroupes(): { [key: string]: Groupe[] } {
    return this.groupes.reduce((groups, groupe) => {
      const option = groupe.optionGroupe || 'AUTRES';
      if (!groups[option]) {
        groups[option] = [];
      }
      groups[option].push(groupe);
      return groups;
    }, {} as { [key: string]: Groupe[] });
  }

  // Get array of option keys for iteration
  get optionKeys(): string[] {
    return Object.keys(this.groupedGroupes).sort();
  }

  // Toggle group visibility
  expandedGroups: { [key: string]: boolean } = {};

  toggleGroup(option: string): void {
    this.expandedGroups[option] = !this.expandedGroups[option];
  }

  isGroupExpanded(option: string): boolean {
    return this.expandedGroups[option] || false;
  }
}