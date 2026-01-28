import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-charts',
  templateUrl: './admin-charts.component.html',
  styleUrls: ['./admin-charts.component.css']
})
export class AdminChartsComponent implements OnInit {
  chartsData: any = null;
  loading = true;

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadChartsData();
  }

  loadChartsData(): void {
    this.adminService.getChartsData().subscribe({
      next: (data) => {
        this.chartsData = data;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Failed to load charts data. Please try again.');
        this.loading = false;
      }
    });
  }

  getPercentage(value: number, total: number): number {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }

  getTotalAppointments(): number {
    if (!this.chartsData?.appointments_by_status) return 0;
    return this.chartsData.appointments_by_status.reduce((sum: number, item: any) => sum + item.count, 0);
  }

  getTotalFeedback(): number {
    if (!this.chartsData?.feedback_distribution) return 0;
    return this.chartsData.feedback_distribution.reduce((sum: number, item: any) => sum + item.count, 0);
  }

  getRatingStars(rating: number): string {
    return '⭐'.repeat(rating);
  }
}
