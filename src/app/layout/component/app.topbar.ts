import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator],
  template: `
    <div class="layout-topbar">
      <div class="layout-topbar-logo-container">
        <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
          <i class="pi pi-bars"></i>
        </button>
        <a class="layout-topbar-logo" routerLink="/">
          <img src="assets/layout/images/logo.png" alt="ESPRIT" />
          <span>ESPRIT</span>
        </a>

      </div>

      <div class="layout-topbar-actions">
        <div class="layout-config-menu">
          <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
            <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
          </button>
          <div class="relative">
            <button
              class="layout-topbar-action layout-topbar-action-highlight"
              pStyleClass="@next"
              enterFromClass="hidden"
              enterActiveClass="animate-scalein"
              leaveToClass="hidden"
              leaveActiveClass="animate-fadeout"
              [hideOnOutsideClick]="true"
            >
              <i class="pi pi-palette"></i>
            </button>
            <app-configurator />
          </div>
        </div>

        <div class="layout-topbar-menu hidden lg:block">
          <div class="layout-topbar-menu-content">
            <button type="button" class="layout-topbar-action profile-btn" (click)="toggleProfileMenu()">
              <i class="pi pi-user"></i>
              <span *ngIf="currentUser">{{ currentUser.matricule }}</span>
              <span *ngIf="!currentUser">Profile</span>
            </button>

            <div *ngIf="showProfileMenu" class="profile-menu-dropdown">
              <div class="profile-header">
                <div class="profile-avatar">
                  <i class="pi pi-user"></i>
                </div>
                <div class="profile-info">
                  <h3>{{ currentUser?.username }}</h3>
                  <p class="role-label">{{ currentUser?.role }}</p>
                </div>
              </div>
              <hr />
              <div class="profile-details">
                <p><strong>Matricule :</strong> {{ currentUser?.matricule }}</p>
                <p><strong>Email :</strong> {{ currentUser?.email }}</p>
              </div>
              <button class="btn-logout" (click)="logout()">Déconnexion</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* === Couleurs ESPRIT === */
    :host {
      --primary-color: #dc3545;
      --primary-color-dark: #b02a37;
      --text-color: #212529;
      --text-muted: #495057;
      --bg-hover: #f8d7da;
    }

    .layout-topbar {
      background: white;
      box-shadow: 0 2px 8px rgb(220 53 69 / 0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;
      height: 60px;
      position: relative;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .layout-topbar-logo-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .layout-menu-button {
      font-size: 1.4rem;
      color: var(--primary-color);
      background: transparent;
      border: none;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .layout-menu-button:hover {
      color: var(--primary-color-dark);
    }

    .layout-topbar-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--primary-color);
      font-weight: 700;
      font-size: 1.3rem;
      text-decoration: none;
      user-select: none;
    }

    .layout-topbar-logo svg {
      height: 30px;
      width: 40px;
    }

    .layout-topbar-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      position: relative;
    }

    .layout-config-menu {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .layout-topbar-action {
      background: transparent;
      border: none;
      color: var(--primary-color);
      font-size: 1.25rem;
      cursor: pointer;
      padding: 0.3rem 0.5rem;
      border-radius: 8px;
      transition: background-color 0.3s ease, color 0.3s ease;
      user-select: none;
    }

    .layout-topbar-action:hover {
      background-color: var(--bg-hover);
      color: var(--primary-color-dark);
    }

    /* Profil bouton */
    .profile-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: var(--primary-color);
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.25rem 0.5rem;
      transition: background-color 0.3s ease;
      border-radius: 8px;
      user-select: none;
    }

    .profile-btn:hover {
      background-color: var(--bg-hover);
    }

    /* Dropdown profil */
    .profile-menu-dropdown {
      position: absolute;
      right: 0;
      top: 100%;
      margin-top: 0.5rem;
      background-color: white;
      width: 260px;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(220, 53, 69, 0.25);
      padding: 1rem 1.5rem;
      z-index: 1000;
      color: var(--text-color);
      font-size: 0.95rem;
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .profile-avatar {
      background-color: var(--primary-color);
      color: white;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.8rem;
      user-select: none;
    }

    .profile-info h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-color);
    }

    .role-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--primary-color);
      text-transform: uppercase;
      margin: 0;
    }

    hr {
      border: none;
      border-top: 1px solid #eee;
      margin-bottom: 1rem;
    }

    .profile-details p {
      margin: 0.3rem 0;
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .profile-details strong {
      color: var(--text-color);
    }

    .btn-logout {
      margin-top: 1rem;
      background-color: var(--primary-color);
      color: white;
      border: none;
      width: 100%;
      padding: 0.6rem;
      font-weight: 600;
      font-size: 1rem;
      border-radius: 10px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      user-select: none;
    }

    .btn-logout:hover {
      background-color: var(--primary-color-dark);
    }
  `]
})
export class AppTopbar implements OnInit {
  currentUser: { username: string; matricule: string; email: string; role: string } | null = null;
  showProfileMenu = false;

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    const username = localStorage.getItem('username');
    const matricule = localStorage.getItem('matricule');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    if (username && email && role && matricule) {
      this.currentUser = { username, matricule, email, role };
    } else {
      this.currentUser = null;
    }
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }

  toggleDarkMode() {
    this.layoutService.layoutConfig.update(state => ({ ...state, darkTheme: !state.darkTheme }));
  }
}
    