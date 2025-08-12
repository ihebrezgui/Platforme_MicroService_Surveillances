import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { ExamenChrono, ExamenChronoRequestDTO, ExamenChronoService } from '../../Service/examen-chrono.service';
import { MyModule } from '../../Entity/module.model';
import { Groupe } from '../../Entity/Groupe';
import { Session } from '../../Entity/Session';
import { Salle } from '../../Entity/Salle';

import { AffectationService } from './../../Service/affectation-service.service';
import { SalleService } from '../../Service/salle-service.service';
import { SessionServiceService } from '../../Service/session-service.service';
import { Enseignant } from '../../Entity/Enseignant';
import { EnseignantService } from '../../Service/enseignant-service.service';
import { CommonModule } from '@angular/common';

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  seance: string;
  module: string;
  groupe: string;
  enseignants: string;
  salles: string;
  periode?: string;
}

interface EventsWithVisibility {
  visibleEvents: CalendarEvent[];
  hiddenEvents: CalendarEvent[];
  totalCount: number;
}

@Component({
  selector: 'app-examen-chrono',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './examen-chrono.component.html',
  styleUrls: ['./examen-chrono.component.scss']
})
export class ExamenChronoComponent implements OnInit {
  examenForm: FormGroup;
  examens: ExamenChrono[] = [];
  modules: MyModule[] = [];
  groupes: Groupe[] = [];
  sessions: Session[] = [];
  enseignants: Enseignant[] = [];

  totalEnseignants = 0;
  affectedEnseignantsCount = 0;

  showForm = false;
  isLoading = false;

  currentDate = new Date();
  currentWeekStart = new Date();
  weekDays: string[] = [];
  weekDates: string[] = [];
  calendarEvents: { [key: string]: { [seance: string]: CalendarEvent[] } } = {};

  expandedSlots = new Set<string>();
  maxVisibleEvents = 2;

  months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  seances = ['08:00-10:00', '10:15-12:15', '13:30-15:30', '15:45-17:45'];
  periodes = ['PERIODE_1', 'PERIODE_2', 'PERIODE_3', 'PERIODE_4'];

  constructor(
    private fb: FormBuilder,
    private examenService: ExamenChronoService,
    private affectationService: AffectationService,
    private salleService: SalleService,
    private sessionService: SessionServiceService,
    private enseignantService: EnseignantService
  ) {
    this.examenForm = this.fb.group({
      sessionId: ['', Validators.required],
      periode: ['PERIODE_1', Validators.required],
      moduleId: ['', Validators.required],
      dateExamen: ['', Validators.required],
      seance: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.initializeWeek();
    this.loadSessions();
    this.loadEnseignants();
    this.loadInitialData();

    this.examenForm.get('periode')?.valueChanges.subscribe(periode => {
      this.loadModulesByPeriode(periode);
      this.groupes = [];
      this.examenForm.patchValue({ moduleId: '', dateExamen: '', seance: '' });
    });

    this.examenForm.get('moduleId')?.valueChanges.subscribe(moduleId => {
      const periode = this.examenForm.get('periode')?.value;
      if (moduleId && periode) {
        this.loadGroupesByModuleAndPeriode(moduleId, periode);
      } else {
        this.groupes = [];
      }
    });
  }

  loadSessions(): void {
    this.sessionService.getAll().subscribe({
      next: sessions => {
        this.sessions = sessions;
        if (sessions.length > 0) {
          this.examenForm.patchValue({ sessionId: sessions[0].id });
        }
      },
      error: err => console.error('Erreur chargement sessions:', err)
    });
  }

  loadEnseignants(): void {
    this.enseignantService.getAllEnseignants().subscribe({
      next: enseignants => {
        this.enseignants = enseignants;
        this.totalEnseignants = enseignants.length;
      },
      error: err => console.error('Erreur chargement enseignants:', err)
    });
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.loadModulesByPeriode(this.examenForm.get('periode')?.value);
    this.loadExamens();
  }

  loadModulesByPeriode(periode: string): void {
    this.affectationService.getModulesByPeriode(periode).subscribe({
      next: modules => {
        this.modules = modules;
        this.isLoading = false;
      },
      error: err => {
        console.error('Erreur chargement modules:', err);
        this.isLoading = false;
      }
    });
  }

  loadGroupesByModuleAndPeriode(moduleId: number, periode: string): void {
    this.affectationService.getGroupesByModuleAndPeriode(moduleId, periode).subscribe({
      next: groupes => this.groupes = groupes,
      error: err => {
        console.error('Erreur chargement groupes:', err);
        this.groupes = [];
      }
    });
  }

  loadExamens(): void {
    this.examenService.getAllExamens().subscribe({
      next: examens => {
        this.examens = examens;

        const salleIdsAll = examens.flatMap(e => e.salleIds);
        const uniqueSalleIds = Array.from(new Set(salleIdsAll));

        if (uniqueSalleIds.length > 0) {
          this.salleService.getSallesByIds(uniqueSalleIds).subscribe({
            next: salles => {
              const salleMap = new Map<number, string>();
              salles.forEach((s: Salle) => {
                const fullSalleName = `Salle: ${s.bloc}${s.etage}${s.nom}`;
                salleMap.set(s.id, fullSalleName);
              });

              this.examens.forEach(exam => {
                exam['salleNames'] = exam.salleIds
                  .map(id => salleMap.get(id) || '')
                  .filter(n => n)
                  .join(', ');
              });

              this.buildCalendarEvents();
              this.updateAffectedEnseignants();
              this.isLoading = false;
            },
            error: err => {
              console.error('Erreur chargement salles:', err);
              this.examens.forEach(exam => (exam['salleNames'] = ''));
              this.buildCalendarEvents();
              this.updateAffectedEnseignants();
              this.isLoading = false;
            }
          });
        } else {
          this.examens.forEach(exam => (exam['salleNames'] = ''));
          this.buildCalendarEvents();
          this.updateAffectedEnseignants();
          this.isLoading = false;
        }
      },
      error: err => {
        console.error('Erreur chargement examens:', err);
        this.isLoading = false;
      }
    });
  }

  buildCalendarEvents(): void {
    this.calendarEvents = {};

    this.examens.forEach(examen => {
      const dateKey = examen.dateExamen;
      const seanceKey = examen.seance;

      if (!this.calendarEvents[dateKey]) {
        this.calendarEvents[dateKey] = {};
      }
      if (!this.calendarEvents[dateKey][seanceKey]) {
        this.calendarEvents[dateKey][seanceKey] = [];
      }

      const fullGroup = `${examen.groupe.niveau}-${examen.groupe.optionGroupe}-${examen.groupe.nomClasse}`;
      this.calendarEvents[dateKey][seanceKey].push({
        id: examen.id,
        title: examen.module.libelleModule,
        date: examen.dateExamen,
        seance: examen.seance,
        module: examen.module.libelleModule,
        groupe: fullGroup,
        enseignants: examen.enseignants.map(e => e.nom).join(', '),
        salles: examen['salleNames'] || '',
        periode: examen.periode || 'PERIODE_1'
      });
    });
  }

  updateAffectedEnseignants(): void {
    const affectedIds = new Set<number>();
    this.examens.forEach(ex => {
      ex.enseignants.forEach(e => {
        if (e.id !== undefined) {
          affectedIds.add(e.id);
        }
      });
    });
    this.affectedEnseignantsCount = affectedIds.size;
  }

  canCreateExamen(): boolean {
    if (!this.examenForm.valid) return false;

    const formValue = this.examenForm.value;

    const enseignantsAffectes = new Set<number>();
    this.examens.forEach(ex => {
      if (ex.dateExamen === formValue.dateExamen && ex.seance === formValue.seance) {
        ex.enseignants.forEach(e => {
          if (e.id !== undefined) {
            enseignantsAffectes.add(e.id);
          }
        });
      }
    });

    // TODO: comparer avec enseignants sélectionnés (à ajouter dans le formulaire)

    return true; // autorisé par défaut
  }

  onSubmit(): void {
    if (!this.examenForm.valid) return;

    if (!this.canCreateExamen()) {
      alert('Certains enseignants sont déjà affectés à ce créneau.');
      return;
    }

    this.isLoading = true;
    const formValue = this.examenForm.value;

    const groupesIds = this.groupes.map(g => g.id);

    const observables = groupesIds.map(gid => {
      const dto: ExamenChronoRequestDTO = {
        sessionId: +formValue.sessionId,
        periode: formValue.periode,
        moduleId: +formValue.moduleId,
        dateExamen: formValue.dateExamen,
        seance: formValue.seance,
        groupeId: gid!
      };
      return this.examenService.createExamen(dto);
    });

    forkJoin(observables).subscribe({
      next: () => {
        this.loadExamens();
        this.toggleForm();
        this.isLoading = false;
      },
      error: err => {
        console.error('Erreur création examens:', err);
        this.isLoading = false;
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.examenForm.reset({
        periode: 'PERIODE_1',
        sessionId: this.sessions.length > 0 ? this.sessions[0].id : ''
      });
      this.groupes = [];
    }
  }

  initializeWeek(): void {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    this.currentWeekStart = new Date(today);
    this.currentWeekStart.setDate(today.getDate() + diffToMonday);
    this.generateWeek();
  }

  generateWeek(): void {
    this.weekDays = [];
    this.weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(this.currentWeekStart);
      date.setDate(this.currentWeekStart.getDate() + i);
      this.weekDays.push(this.dayNames[date.getDay()]);
      this.weekDates.push(date.toISOString().split('T')[0]);
    }
  }

  previousWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.generateWeek();
    this.expandedSlots.clear();
  }

  nextWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.generateWeek();
    this.expandedSlots.clear();
  }

  getWeekRange(): string {
    const endDate = new Date(this.currentWeekStart);
    endDate.setDate(this.currentWeekStart.getDate() + 6);
    const startStr = `${this.currentWeekStart.getDate()} ${this.months[this.currentWeekStart.getMonth()]}`;
    const endStr = `${endDate.getDate()} ${this.months[endDate.getMonth()]} ${endDate.getFullYear()}`;
    return `${startStr} - ${endStr}`;
  }

  getEventsForDateAndSeanceWithVisibility(dateKey: string, seance: string, maxVisible: number = 2): EventsWithVisibility {
    const allEvents = this.calendarEvents[dateKey]?.[seance] || [];
    return {
      visibleEvents: allEvents.slice(0, maxVisible),
      hiddenEvents: allEvents.slice(maxVisible),
      totalCount: allEvents.length
    };
  }

  isSlotExpanded(dateKey: string, seance: string): boolean {
    return this.expandedSlots.has(`${dateKey}-${seance}`);
  }

  toggleSlotExpansion(dateKey: string, seance: string): void {
    const slotId = `${dateKey}-${seance}`;
    if (this.expandedSlots.has(slotId)) {
      this.expandedSlots.delete(slotId);
    } else {
      this.expandedSlots.add(slotId);
    }
  }

  getPeriodClass(periode: string): string {
    return 'event-' + periode.toLowerCase();
  }

  isToday(dateKey: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return dateKey === today;
  }

  sanitizeSeanceClass(seance: string): string {
    return 'event-' + seance.toLowerCase().replace(/[:]/g, '').replace(/-/g, '_');
  }

  getEventTooltip(event: CalendarEvent): string {
    return `${event.module} - ${event.groupe} - ${event.enseignants} - Salle: ${event.salles}`;
  }

  getHiddenEventsCount(dateKey: string, seance: string): number {
    const eventData = this.getEventsForDateAndSeanceWithVisibility(dateKey, seance, this.maxVisibleEvents);
    return eventData.hiddenEvents.length;
  }

  hasHiddenEvents(dateKey: string, seance: string): boolean {
    return this.getHiddenEventsCount(dateKey, seance) > 0;
  }
}
