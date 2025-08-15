import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fraude, FraudeRequestDTO, FraudeService } from '../../Service/fraude.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fraude',
  templateUrl: './fraude.component.html',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  styleUrls: ['./fraude.component.scss']
})
export class FraudeComponent implements OnInit {
  fraudeForm: FormGroup;
  fraudes: Fraude[] = [];
  submitted = false;
  filtreStatut: string = 'TOUS';
  currentUser: any;
  showTypeInput = false;
  typeOptions = ['Copie', 'Plagiat', 'Tricherie', 'Autre'];

  constructor(private fb: FormBuilder, private fraudeService: FraudeService) {
    this.fraudeForm = this.fb.group({
      nomEtudiant: ['', Validators.required],
      matricule: ['', Validators.required],
      nomEnseignant: ['', Validators.required],
      matriculeEnseignant: ['', Validators.required],
      groupeNom: ['', Validators.required],
      groupeId: [null, Validators.required],
      type: ['', Validators.required],
      autreType: [''],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.currentUser = {
      id: +(localStorage.getItem('id') || '0'),
      matricule: localStorage.getItem('matricule'),
      role: localStorage.getItem('role')
    };
    this.loadFraudes();

    this.fraudeForm.get('type')?.valueChanges.subscribe(value => {
      this.showTypeInput = value === 'Autre';
      if (!this.showTypeInput) {
        this.fraudeForm.get('autreType')?.setValue('');
      }
    });
  }

 loadFraudes() {
  this.fraudeService.getFraudes(this.filtreStatut).subscribe(data => {
    if (this.currentUser.role === 'SUPER_ADMIN' || this.currentUser.role === 'ADMIN') {
      this.fraudes = data; // voit tout
    } else {
      // Enseignant : voit seulement superadmin/admin + ses propres fraudes
      this.fraudes = data.filter(f => 
        f.roleEnseignant === 'SUPER_ADMIN' || f.roleEnseignant === 'ADMIN' || f.enseignantId === this.currentUser.id
      );
    }
  });
}

  onSubmit() {
    this.submitted = true;
    if (this.fraudeForm.invalid) return;

const dto: FraudeRequestDTO = {
  nomEtudiant: this.fraudeForm.value.nomEtudiant,
  matricule: this.fraudeForm.value.matricule,
  nomEnseignant: this.fraudeForm.value.nomEnseignant,
  matriculeEnseignant: this.fraudeForm.value.matriculeEnseignant,
  nomGroupe: this.fraudeForm.value.groupeNom, // correspond au DTO Java
  groupeId: this.fraudeForm.value.groupeId,
  type: this.showTypeInput ? this.fraudeForm.value.autreType : this.fraudeForm.value.type,
  description: this.fraudeForm.value.description
};
  

    this.fraudeService.declareFraude(dto).subscribe(() => {
      alert('Fraude déclarée avec succès !');
      this.fraudeForm.reset();
      this.submitted = false;
      this.loadFraudes();
    });
  }

  filtrerFraudes() {
    this.loadFraudes();
  }

  traiterFraude(f: Fraude) {
    const rapport = prompt('Entrez le rapport :');
    if (rapport) {
      this.fraudeService.traiterFraude(f.id, rapport).subscribe(() => this.loadFraudes());
    }
  }

  archiverFraude(f: Fraude) {
    if (confirm('Archiver cette fraude ?')) {
      this.fraudeService.archiverFraude(f.id).subscribe(() => this.loadFraudes());
    }
  }
}
