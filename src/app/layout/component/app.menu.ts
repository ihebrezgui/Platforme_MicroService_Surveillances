import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `
    <ul class="layout-menu">
      <ng-container *ngFor="let item of model; let i = index">
        <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
        <li *ngIf="item.separator" class="menu-separator"></li>
      </ng-container>
    </ul>
  `,
  styles: [`
    .layout-menu {
      list-style: none;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(220, 53, 69, 0.15);
      width: 240px;
    }

    .layout-menu li {
      position: relative;
    }

    .menu-separator {
      border-top: 1px solid #dc3545;
      margin: 0.5rem 0;
      opacity: 0.4;
    }

    .layout-menu > li > a,
    .layout-menu > li > div {
      display: flex;
      align-items: center;
      padding: 0.75rem 1.25rem;
      font-weight: 600;
      font-size: 1rem;
      color: #dc3545;
      cursor: pointer;
      transition: background-color 0.3s ease;
      border-radius: 6px;
      user-select: none;
    }

    .layout-menu > li > a:hover,
    .layout-menu > li > div:hover {
      background-color: #f8d7da;
      color: #a71d2a;
    }

    .layout-menu .pi {
      margin-right: 0.75rem;
      font-size: 1.2rem;
    }
  `]
})
export class AppMenu implements OnInit {
  model: MenuItem[] = [];

  ngOnInit() {
    const role = localStorage.getItem('role');

    let dashboardLink = '/';
    let dashboardLabel = 'Dashboard';

    if (role === 'SUPER_ADMIN') {
      dashboardLink = '/dashboard-superadmin';
      dashboardLabel = 'Dashboard Super Admin';
    } else if (role === 'ADMIN') {
      dashboardLink = '/dashboard-admin';
      dashboardLabel = 'Dashboard Admin';
    } else if (role === 'ENSEIGNANT') {
      dashboardLink = '/dashboard-enseignant';
      dashboardLabel = 'Dashboard Enseignant';
    }

    this.model = [
      {
        label: 'Home',
        items: [
          { label: dashboardLabel, icon: 'pi pi-fw pi-home', routerLink: [dashboardLink] }
        ]
      },

      

      ...(role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'ENSEIGNANT' ? [{
        label: 'Gestion des Users',
        items: [
          { label: 'Users', icon: 'pi pi-fw pi-id-card', routerLink: ['/users'] }
        ]
      }] : []),



      ...(role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'ENSEIGNANT' ?[{
        label: 'Gestion des Enseignants',
        items: [
          { label: 'Enseignants', icon: 'pi pi-fw pi-id-card', routerLink: ['/enseignants'] }
        ]
      }] : []),

      ...(role === 'SUPER_ADMIN' || role === 'ADMIN' ? [{
          label: 'Gestion des modules',
          items: [
            { label: 'Modules', icon: 'pi pi-fw pi-id-card', routerLink: ['/module_manger'] },
            { label: 'Sessions', icon: 'pi pi-fw pi-id-card', routerLink: ['/session'] },
            { label: 'Classe/Modules', icon: 'pi pi-fw pi-id-card', routerLink: ['/AffectationClasse'] },
            { label: 'Enseignant/Module', icon: 'pi pi-fw pi-id-card', routerLink: ['/modules'] }
          ]
            }] : role === 'ENSEIGNANT' ? [{
              label: 'Gestion des modules',
              items: [
                { label: 'Enseignant/Module', icon: 'pi pi-fw pi-id-card', routerLink: ['/modules'] }
              ]
            }] : []),

      ...(role === 'SUPER_ADMIN' || role === 'ADMIN'  ? [{
        label: 'Gestion des Classes',
        items: [
          { label: 'Classes', icon: 'pi pi-fw pi-id-card', routerLink: ['/groupe_manager'] }
        ]
      }] : []),

      ...(role === 'SUPER_ADMIN' || role === 'ADMIN' ? [{
        label: 'Gestion des Examens',
        items: [
          { label: 'Affectation Classes/salles/Enseignants', icon: 'pi pi-fw pi-id-card', routerLink: ['/GestionExamen'] },
          { label: 'Affectation Chrono', icon: 'pi pi-fw pi-id-card', routerLink: ['/examanchreno'] }
        ]
      }] : []),

      ...(role === 'SUPER_ADMIN' || role === 'ADMIN' ? [{
        label: 'Calendrier des Enseignants',
        items: [
          { label: 'Emploi du temps', icon: 'pi pi-fw pi-id-card', routerLink: ['/calendrier-filtre'] }
        ]
      }] : []),

      ...(role === 'SUPER_ADMIN' || role === 'ADMIN' ? [{
        label: 'Calendrier des Surveillances',
        items: [
          { label: 'Emploi du surveillance', icon: 'pi pi-fw pi-id-card', routerLink: ['/Surveillance'] }
        ]
      }] : []),

      ...(role === 'SUPER_ADMIN' || role === 'ADMIN' ? [{
        label: 'Gestion des salles',
        items: [
          { label: 'Salles', icon: 'pi pi-fw pi-id-card', routerLink: ['/salles'] }
        ]
      }] : []),

      {
        label: 'Gestion des Fraudes',
        items: [
          { label: 'Fraudes', icon: 'pi pi-fw pi-id-card', routerLink: ['/fraudes'] }
        ]
      }
    ];
  }
}
