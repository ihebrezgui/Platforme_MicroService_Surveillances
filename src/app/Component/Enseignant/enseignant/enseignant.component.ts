import { Component, OnInit } from '@angular/core';
import { Enseignant } from '../../../Entity/Enseignant';
import { EnseignantService } from '../../../Service/enseignant-service.service';
import { MyModule } from '../../../Entity/module.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-enseignant',
   imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './enseignant.component.html',
  styleUrls: ['./enseignant.component.scss']
})
export class EnseignantComponent implements OnInit {
  enseignants: Enseignant[] = [];
  modules: MyModule[] = [];

  constructor(private enseignantService: EnseignantService) {}

  ngOnInit(): void {
    this.loadModules();
    this.loadEnseignants();
  }

  loadModules() {
    this.enseignantService.getAllModules().subscribe({
      next: (mods) => {
        this.modules = mods;
      },
      error: (err) => {
        console.error('Erreur chargement modules :', err);
      }
    });
  }

  loadEnseignants() {
    this.enseignantService.getAllEnseignants().subscribe({
      next: (data) => {
        this.enseignants = data;
      },
      error: (err) => {
        console.error('Erreur chargement enseignants :', err);
      }
    });
  }

  getModuleLibelle(moduleId: number): string {
  const mod = this.modules.find(m => m.id === moduleId);
  return mod ? `${mod.libelleModule} (${mod.unitePedagogique.libelle})` : 'Module inconnu';
}

}
