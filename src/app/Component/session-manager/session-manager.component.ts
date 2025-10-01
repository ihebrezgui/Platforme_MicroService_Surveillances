import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SessionServiceService } from '../../Service/session-service.service';
import { ModuleServiceService } from '../../Service/module-service.service';
import { Session } from '../../Entity/Session';
import { MyModule } from '../../Entity/module.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-session-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-manager.component.html',
  styleUrl: './session-manager.component.scss'
})
export class SessionManagerComponent implements OnInit {
  sessions: Session[] = [];
  newSession: Session = { nom_session: '' };
  editingSession: Session | null = null;
  showForm = false;
  
  // Module assignment properties
  allModules: MyModule[] = [];
  selectedSession: Session | null = null;
  showModuleAssignment = false;
  selectedModuleIds: number[] = [];
  
  // Module search/filter properties
  moduleSearchTerm = '';
  showAllModules = false;
  filteredModules: MyModule[] = [];
  
  // View assigned modules properties
  showAssignedModules = false;
  assignedModulesToView: MyModule[] = [];

  // CSV Import properties
  selectedFile: File | null = null;
  showImportSection = false;
  importMessage = '';

  constructor(
    private sessionService: SessionServiceService,
    private moduleService: ModuleServiceService
  ) {}

  ngOnInit(): void {
    this.loadSessions();
    this.loadModules();
  }

  get editing(): boolean {
    return this.editingSession !== null;
  }

  get sessionModel(): Session {
    return this.editingSession ?? this.newSession;
  }

  loadSessions(): void {
    console.log('Loading sessions...');
    this.sessionService.getAll().subscribe({
      next: (data) => {
        console.log('Sessions loaded successfully:', data);
        this.sessions = data;
      },
      error: (error) => {
        console.error('Error loading sessions:', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Impossible de charger les sessions',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
        this.sessions = []; // Ensure sessions array is initialized
      }
    });
  }

  saveSession(): void {
    const sessionToSave = this.editingSession ?? this.newSession;
    this.sessionService[this.editing ? 'update' : 'add'](sessionToSave).subscribe({
      next: () => {
        this.editingSession = null;
        this.newSession = { nom_session: '' };
        this.showForm = false;
        this.loadSessions();
        Swal.fire({
          title: 'Succès!',
          text: `Session ${this.editing ? 'modifiée' : 'ajoutée'} avec succès`,
          icon: 'success',
          confirmButtonColor: '#10b981',
          timer: 2000,
          timerProgressBar: true
        });
      },
      error: (error) => {
        console.error('Error saving session:', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Impossible de sauvegarder la session',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  editSession(session: Session): void {
    this.editingSession = { ...session };
    this.showForm = true;
  }

  deleteSession(id?: number): void {
    if (id == null) return;

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
        this.sessionService.delete(id).subscribe({
          next: () => {
            this.loadSessions();
            Swal.fire({
              title: 'Supprimé !',
              text: 'Session supprimée avec succès',
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

  cancelEdit(): void {
    this.editingSession = null;
    this.newSession = { nom_session: '' };
    this.showForm = false;
  }

  openAddForm(): void {
    this.editingSession = null;
    this.newSession = { nom_session: '' };
    this.showForm = true;
  }

  closeForm(): void {
    this.cancelEdit();
  }

  trackBySessionId(index: number, session: Session): any {
    return session.id || index;
  }

  // Module assignment methods
  loadModules(): void {
    this.moduleService.getAll().subscribe((data) => {
      this.allModules = data;
      this.filteredModules = data.slice(0, 10); // Show only first 10 by default
    });
  }

  openModuleAssignment(session: Session): void {
    this.selectedSession = session;
    this.selectedModuleIds = session.moduleIds || [];
    this.moduleSearchTerm = '';
    this.showAllModules = false;
    this.filteredModules = this.allModules.slice(0, 10); // Reset to first 10
    this.showModuleAssignment = true;
  }

  closeModuleAssignment(): void {
    this.selectedSession = null;
    this.selectedModuleIds = [];
    this.moduleSearchTerm = '';
    this.showAllModules = false;
    this.showModuleAssignment = false;
  }

  toggleModuleSelection(moduleId: number): void {
    const index = this.selectedModuleIds.indexOf(moduleId);
    if (index > -1) {
      this.selectedModuleIds.splice(index, 1);
    } else {
      this.selectedModuleIds.push(moduleId);
    }
  }

  isModuleSelected(moduleId: number): boolean {
    return this.selectedModuleIds.includes(moduleId);
  }

  saveModuleAssignment(): void {
    if (this.selectedSession && this.selectedSession.id) {
      console.log('Saving module assignment for session:', this.selectedSession.id);
      console.log('Selected module IDs:', this.selectedModuleIds);
      
      this.sessionService.assignModulesToSession(this.selectedSession.id, this.selectedModuleIds)
        .subscribe({
          next: (response) => {
            console.log('Module assignment successful:', response);
            this.loadSessions(); // Reload sessions to get updated module data
            this.closeModuleAssignment();
            Swal.fire({
              title: 'Succès!',
              text: 'Modules assignés avec succès',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              timerProgressBar: true
            });
          },
          error: (error) => {
            console.error('Error assigning modules:', error);
            Swal.fire({
              title: 'Erreur',
              text: 'Erreur lors de l\'assignation des modules',
              icon: 'error',
              confirmButtonColor: '#ef4444'
            });
          }
        });
    } else {
      console.error('No selected session or session ID');
      Swal.fire({
        title: 'Erreur',
        text: 'Aucune session sélectionnée',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    }
  }

  removeModuleFromSession(session: Session, moduleId: number): void {
    if (session.id) {
      this.sessionService.removeModuleFromSession(session.id, moduleId)
        .subscribe(() => {
          this.loadSessions(); // Reload sessions to get updated module data
        });
    }
  }

  getModuleName(moduleId: number): string {
    const module = this.allModules.find(m => m.id === moduleId);
    return module ? module.libelleModule : `Module ${moduleId}`;
  }

  formatPeriod(dateDebut: string, dateFin: string): string {
    if (!dateDebut || !dateFin) return '';

    const startDate = new Date(dateDebut);
    const endDate = new Date(dateFin);

    const startFormatted = startDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });

    const endFormatted = endDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });

    return `${startFormatted} - ${endFormatted}`;
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

  getTypeSessionDisplayName(typeSession: string): string {
    const typeMap: { [key: string]: string } = {
      'NORMALE': 'Session Normale',
      'RATTRAPAGE': 'Session de Rattrapage'
    };
    return typeMap[typeSession] || typeSession;
  }

  // Module search and filter methods
  searchModules(): void {
    if (this.moduleSearchTerm.trim() === '') {
      this.filteredModules = this.showAllModules ? this.allModules : this.allModules.slice(0, 10);
    } else {
      const searchTerm = this.moduleSearchTerm.toLowerCase();
      this.filteredModules = this.allModules.filter(module => 
        module.libelleModule.toLowerCase().includes(searchTerm) ||
        module.codeModule.toLowerCase().includes(searchTerm)
      );
    }
  }

  toggleShowAllModules(): void {
    this.showAllModules = !this.showAllModules;
    this.searchModules();
  }

  clearSearch(): void {
    this.moduleSearchTerm = '';
    this.searchModules();
  }

  // View assigned modules methods
  viewAssignedModules(session: Session): void {
    this.selectedSession = session;
    this.assignedModulesToView = [];
    
    if (session.moduleIds && session.moduleIds.length > 0) {
      // Get full module details for assigned modules
      this.assignedModulesToView = this.allModules.filter(module => 
        session.moduleIds!.includes(module.id)
      );
    }
    
    this.showAssignedModules = true;
  }

  closeAssignedModulesView(): void {
    this.showAssignedModules = false;
    this.selectedSession = null;
    this.assignedModulesToView = [];
  }

  removeModuleFromAssignedView(moduleId: number): void {
    if (this.selectedSession && this.selectedSession.id) {
      this.sessionService.removeModuleFromSession(this.selectedSession.id, moduleId)
        .subscribe(() => {
          // Update the local view
          this.assignedModulesToView = this.assignedModulesToView.filter(m => m.id !== moduleId);
          // Update the session's moduleIds
          if (this.selectedSession) {
            this.selectedSession.moduleIds = this.selectedSession.moduleIds?.filter(id => id !== moduleId) || [];
          }
          // Reload sessions to update the main view
          this.loadSessions();
        });
    }
  }

  // CSV Import methods
  toggleImportSection(): void {
    this.showImportSection = !this.showImportSection;
    if (!this.showImportSection) {
      this.selectedFile = null;
      this.importMessage = '';
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Vérifier que c'est un fichier CSV
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        this.selectedFile = file;
        this.importMessage = '';
        
        // Debug: Lire le contenu du fichier pour vérifier le format
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          console.log('CSV File content preview:', content.substring(0, 200));
          
          // Vérifier les premières lignes
          const lines = content.split('\n');
          if (lines.length > 0) {
            console.log('First line:', JSON.stringify(lines[0]));
            if (lines.length > 1) {
              console.log('Second line:', JSON.stringify(lines[1]));
            }
          }
        };
        reader.readAsText(file);
        
      } else {
        this.selectedFile = null;
        Swal.fire({
          title: 'Erreur',
          text: 'Veuillez sélectionner un fichier CSV valide',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  }

  importCsv(): void {
    if (!this.selectedFile) {
      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez sélectionner un fichier CSV',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
      return;
    }
    
    console.log('Starting CSV import with file:', this.selectedFile.name, 'Size:', this.selectedFile.size);
    
    this.sessionService.importCsv(this.selectedFile).subscribe({
      next: (importedSessions) => {
        console.log('CSV import successful:', importedSessions);
        this.importMessage = `Import réussi: ${importedSessions.length} session(s) ajoutée(s).`;
        this.loadSessions();
        this.selectedFile = null;
        this.showImportSection = false;
        
        Swal.fire({
          title: 'Succès!',
          text: `${importedSessions.length} session(s) importée(s) avec succès`,
          icon: 'success',
          confirmButtonColor: '#10b981',
          timer: 3000,
          timerProgressBar: true
        });
      },
      error: (err) => {
        console.error('Error importing CSV:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          error: err.error,
          message: err.message,
          url: err.url
        });
        
        let errorMessage = 'Erreur lors de l\'import du fichier CSV';
        
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error.message) {
            errorMessage = err.error.message;
          } else if (err.error.error) {
            errorMessage = err.error.error;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        // Ajouter des détails supplémentaires pour le débogage
        if (err.status === 400) {
          errorMessage += ' (Bad Request - Vérifiez le format du fichier CSV)';
        } else if (err.status === 415) {
          errorMessage += ' (Type de fichier non supporté)';
        } else if (err.status === 500) {
          errorMessage += ' (Erreur serveur)';
        }
        
        this.importMessage = errorMessage;
        
        Swal.fire({
          title: 'Erreur d\'import',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#ef4444',
          html: `
            <div style="text-align: left;">
              <p><strong>Détails de l'erreur:</strong></p>
              <p>Status: ${err.status} ${err.statusText}</p>
              <p>Message: ${errorMessage}</p>
              <br>
              <p><strong>Format CSV attendu:</strong></p>
              <code style="font-size: 12px; display: block; background: #f5f5f5; padding: 10px; border-radius: 4px;">
                nom_session,periode,typeSession,dateDebut,dateFin<br>
                Session Test,PERIODE_1,NORMALE,2024-01-15,2024-02-15
              </code>
            </div>
          `
        });
      }
    });
  }
}