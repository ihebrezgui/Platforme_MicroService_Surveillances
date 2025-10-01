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
export class UserComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading: boolean = false;
  role: string = '';
  currentUserId: number = 0;
  searchTerm: string = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 15;

  constructor(private userService: UserServiceService, private router: Router) {
    // Récupérer role et id de l'utilisateur connecté depuis localStorage
    this.role = localStorage.getItem('role') || '';
    this.currentUserId = Number(localStorage.getItem('id')) || 0;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        // Filtrage selon rôle
        if (this.role === 'ENSEIGNANT') {
          this.users = data.filter(u => u.id === this.currentUserId);
        } else {
          this.users = data;
        }
        this.filteredUsers = [...this.users];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement utilisateurs', err);
        this.isLoading = false;
        Swal.fire({
          title: 'Erreur',
          text: 'Impossible de charger les utilisateurs',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  toggleUserActive(user: User): void {
    if (this.role !== 'SUPER_ADMIN') return; // seule super admin peut activer/désactiver

    const newStatus = !user.active;
    const actionText = newStatus ? 'activer' : 'désactiver';
    
    Swal.fire({
      title: 'Confirmer l\'action',
      text: `Êtes-vous sûr de vouloir ${actionText} cet utilisateur ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus ? '#10b981' : '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Oui, ${actionText}`,
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.setUserActiveStatus(user.id, newStatus).subscribe({
          next: (response) => {
            user.active = newStatus;
            Swal.fire({
              title: 'Succès',
              text: response.message,
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              timerProgressBar: true
            });
          },
          error: () => {
            Swal.fire({
              title: 'Erreur',
              text: 'Impossible de changer le statut',
              icon: 'error',
              confirmButtonColor: '#ef4444'
            });
          }
        });
      }
    });
  }

  onDeleteUser(id: number): void {
    if (this.role !== 'SUPER_ADMIN') return; // seule super admin peut supprimer

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
        this.userService.deleteUser(id).subscribe({
          next: (message) => {
            Swal.fire({
              title: 'Supprimé !',
              text: message,
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              timerProgressBar: true
            });
            this.loadUsers();
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

  updateUser(user: User): void {
    if (this.role !== 'SUPER_ADMIN') return; // seule super admin peut modifier
    this.router.navigate(['/update-user', user.id]);
  }

  navigateToRegister(): void {
    if (this.role !== 'SUPER_ADMIN' && this.role !== 'ADMIN') return; // seule super admin et admin peut ajouter
    this.router.navigate(['/register']);
  }

  // Helper method to get user initials for avatar
  getInitials(username: string): string {
    if (!username) return '?';
    
    const names = username.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  // TrackBy function for better performance with *ngFor
  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  refreshUsers(): void {
    this.loadUsers();
  }

  // Search functionality
  onSearchChange(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  // Status filter functionality
  onStatusFilterChange(status: 'all' | 'active' | 'inactive'): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  // Apply both search and status filters
  applyFilters(): void {
    let filtered = [...this.users];

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(user => {
        if (this.statusFilter === 'active') {
          return user.active === true;
        } else if (this.statusFilter === 'inactive') {
          return user.active === false;
        }
        return true;
      });
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(user => 
        user.username?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.matricule?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
      );
    }

    this.filteredUsers = filtered;
    this.currentPage = 1; // Reset to first page when filtering
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.filteredUsers = [...this.users];
    this.currentPage = 1;
  }

  getActiveUsersCount(): number {
    return this.users.filter(user => user.active).length;
  }

  getInactiveUsersCount(): number {
    return this.users.filter(user => !user.active).length;
  }

  getRoleClass(role: string): string {
    if (!role) return '';
    return role.toLowerCase();
  }

  formatEmail(email: string): string {
    if (!email) return '';
    return email.toLowerCase();
  }

  sortUsers(column: string): void {
    console.log(`Sorting by ${column}`);
  }

  // Pagination methods
  getPaginatedUsers(): User[] {
    const startIndex = this.getStartIndex();
    const endIndex = this.getEndIndex();
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  getEndIndex(): number {
    return Math.min(this.getStartIndex() + this.itemsPerPage, this.filteredUsers.length);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const currentPage = this.currentPage;
    const pages: number[] = [];

    // Always show first page
    if (totalPages > 0) {
      pages.push(1);
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis if there's a gap
    if (start > 2) {
      pages.push(-1); // -1 represents ellipsis
    }

    // Add pages around current page
    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    // Add ellipsis if there's a gap
    if (end < totalPages - 1) {
      pages.push(-2); // -2 represents ellipsis
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
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
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }
}
