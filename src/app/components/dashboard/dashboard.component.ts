import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, RippleModule, ButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  sections = [
    { name: 'Users', icon: 'pi pi-users' },
    { name: 'Products', icon: 'pi pi-box' },
    { name: 'Orders', icon: 'pi pi-shopping-cart' },
    { name: 'Analytics', icon: 'pi pi-chart-bar' },
  ];
}
