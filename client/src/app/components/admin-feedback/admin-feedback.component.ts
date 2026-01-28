import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-feedback',
  templateUrl: './admin-feedback.component.html',
  styleUrls: ['./admin-feedback.component.css']
})
export class AdminFeedbackComponent implements OnInit {
  feedbackList: any[] = [];
  loading = true;
  ratingFilter = '';
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadFeedback();
  }

  loadFeedback(): void {
    this.loading = true;
    const url = this.ratingFilter 
      ? `${this.apiUrl}/admin/feedback?rating=${this.ratingFilter}`
      : `${this.apiUrl}/admin/feedback`;
    
    
    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Handle both paginated and non-paginated responses
        this.feedbackList = response.data || response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Feedback error:', error);
        this.notificationService.error('Failed to load feedback: ' + (error.error?.message || error.message));
        this.loading = false;
      }
    });
  }

  filterByRating(): void {
    this.loadFeedback();
  }

  getRatingStars(rating: number): string {
    return '⭐'.repeat(rating);
  }

  toggleVisibility(feedback: any): void {
    const url = `${this.apiUrl}/admin/feedback/${feedback.id}/toggle-visibility`;
    
    this.http.put(url, {}).subscribe({
      next: (response: any) => {
        feedback.is_hidden = !feedback.is_hidden;
        this.notificationService.success(response.message);
      },
      error: (error) => {
        this.notificationService.error('Failed to update visibility');
      }
    });
  }
}
