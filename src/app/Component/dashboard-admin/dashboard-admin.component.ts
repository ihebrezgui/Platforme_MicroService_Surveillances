import { Component } from '@angular/core';
import { AppTopbar } from "../../layout/component/app.topbar";
import { AppSidebar } from "../../layout/component/app.sidebar";

@Component({
  selector: 'app-dashboard-admin',
  imports: [AppTopbar, AppSidebar],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent {

}
