import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: any = {};
  loading = true;

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Failed to load dashboard statistics. Please try again.');
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    return `badge badge-${status}`;
  }
}
