import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-calendar',
  templateUrl: './admin-calendar.component.html',
  styleUrls: ['./admin-calendar.component.css']
})
export class AdminCalendarComponent implements OnInit {
  appointments: any[] = [];
  loading = true;
  currentMonth: Date = new Date();
  calendarDays: any[] = [];

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadCalendarData();
  }

  loadCalendarData(): void {
    const startDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const endDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);


    this.loading = true;
    this.adminService.getCalendarAppointments(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    ).subscribe({
      next: (data) => {
        this.appointments = data;
        this.generateCalendar();
        this.loading = false;
      },
      error: (error) => {
        console.error('Calendar error:', error);
        this.notificationService.error('Failed to load calendar data. Please try again.');
        this.loading = false;
      }
    });
  }

  generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    this.calendarDays = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push(null);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const dayAppointments = this.appointments.filter(apt => {
        // Extract just the date part from the appointment_date (remove timestamp)
        const aptDate = apt.appointment_date.split('T')[0];
        return aptDate === dateStr;
      });
      
      // Count by status
      const pending = dayAppointments.filter(a => a.status === 'pending').length;
      const confirmed = dayAppointments.filter(a => a.status === 'confirmed').length;
      const completed = dayAppointments.filter(a => a.status === 'completed').length;
      const cancelled = dayAppointments.filter(a => a.status === 'cancelled').length;
      
      this.calendarDays.push({
        day,
        date: dateStr,
        appointments: dayAppointments,
        pending,
        confirmed,
        completed,
        cancelled,
        total: dayAppointments.length
      });
    }
  }

  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1);
    this.loadCalendarData();
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1);
    this.loadCalendarData();
  }

  getMonthName(): string {
    return this.currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  isToday(dateStr: string): boolean {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    return dateStr === todayStr;
  }
}
