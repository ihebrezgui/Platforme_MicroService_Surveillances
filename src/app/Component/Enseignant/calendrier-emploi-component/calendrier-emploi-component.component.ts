import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmploiDuTemps, EmploiDuTempsService, Groupe } from '../../../Service/emploi-du-temps.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendrier-emploi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendrier-emploi-component.component.html',
  styleUrls: ['./calendrier-emploi-component.component.scss'],
})
export class CalendrierEmploiComponentComponent implements OnInit {

  emploi: EmploiDuTemps[] = [];
  enseignantId!: number;
  groupes: Groupe[] = [];

  jours: Date[] = [];
  heures: string[] = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];

  dateSelectionnee!: string;

  constructor(
    private route: ActivatedRoute,
    private emploiService: EmploiDuTempsService
  ) {}

  ngOnInit(): void {
    this.enseignantId = Number(this.route.snapshot.paramMap.get('id'));

    const aujourdhui = new Date();
    this.dateSelectionnee = aujourdhui.toISOString().substring(0, 10);

    // Charger les groupes d’abord, puis les emplois
    this.emploiService.getAllGroupes().subscribe(data => {
      this.groupes = data;
      this.chargerEmploisEtSemaine(this.dateSelectionnee);
    });
  }

  chargerEmploisEtSemaine(dateStr: string) {
    const date = new Date(dateStr);
    const debutSemaine = this.getDateDebutSemaine(date);

    this.jours = [];
    for (let i = 0; i < 7; i++) {
      const jour = new Date(debutSemaine);
      jour.setDate(debutSemaine.getDate() + i);
      this.jours.push(jour);
    }

    this.emploiService.getByEnseignant(this.enseignantId).subscribe(data => {
      this.emploi = data;
    });
  }

  getDateDebutSemaine(date: Date): Date {
    const day = date.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    const debut = new Date(date);
    debut.setDate(date.getDate() + diff);
    debut.setHours(0, 0, 0, 0);
    return debut;
  }

  isSameDate(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  estOccupe(heure: string, dayOffset: number): boolean {
    const dateAAfficher = this.jours[dayOffset];
    return this.emploi.some(e =>
      this.convertHeure(e.heureDebut) === heure &&
      this.isSameDate(new Date(e.date), dateAAfficher)
    );
  }

  getActivite(heure: string, dayOffset: number): string {
    const dateAAfficher = this.jours[dayOffset];
    const e = this.emploi.find(e =>
      this.convertHeure(e.heureDebut) === heure &&
      this.isSameDate(new Date(e.date), dateAAfficher)
    );
    return e?.typeActivite || '';
  }

  getSalle(heure: string, dayOffset: number): string {
    const dateAAfficher = this.jours[dayOffset];
    const e = this.emploi.find(e =>
      this.convertHeure(e.heureDebut) === heure &&
      this.isSameDate(new Date(e.date), dateAAfficher)
    );
    return e?.salle || '';
  }

  // Récupérer le nom du groupe via groupeId
  getNomGroupeById(groupeId: number): string {
    const groupe = this.groupes.find(g => g.id === groupeId);
    return groupe ? groupe.nomClasse : '';
  }

  getGroupe(heure: string, dayOffset: number): string {
    const dateAAfficher = this.jours[dayOffset];
    const e = this.emploi.find(e =>
      this.convertHeure(e.heureDebut) === heure &&
      this.isSameDate(new Date(e.date), dateAAfficher)
    );
    if (e) {
      return this.getNomGroupeById(e.groupeId);
    }
    return '';
  }

  convertHeure(heure: string): string {
    return heure?.toString().substring(0, 5);
  }

  onChangeDateFilter(event: any) {
    this.dateSelectionnee = event.target.value;
    this.chargerEmploisEtSemaine(this.dateSelectionnee);
  }
}
