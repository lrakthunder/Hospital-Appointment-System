import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackService } from '../../services/feedback.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  feedbackForm!: FormGroup;
  myFeedback: any[] = [];
  loading = false;
  success = '';
  error = '';
  editingFeedbackId: number | null = null;
  todayFeedback: any = null;

  departments = [
    'General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics',
    'Dermatology', 'ENT', 'Ophthalmology', 'Gynecology', 'Neurology', 'Psychiatry'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private feedbackService: FeedbackService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.feedbackForm = this.formBuilder.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      department: [''],
      comment: ['', Validators.required]
    });

    this.loadMyFeedback();
  }

  loadMyFeedback(): void {
    this.feedbackService.getMyFeedback().subscribe({
      next: (data) => {
        this.myFeedback = data;
        // Check if user has feedback from today
        const today = new Date().toDateString();
        this.todayFeedback = data.find((f: any) => {
          const feedbackDate = new Date(f.created_at).toDateString();
          return feedbackDate === today;
        });
      },
      error: (error) => {
        console.error('Error loading feedback:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.feedbackForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    if (this.editingFeedbackId) {
      // Update existing feedback
      this.feedbackService.updateFeedback(this.editingFeedbackId, this.feedbackForm.value).subscribe({
        next: (response) => {
          this.notificationService.success('Feedback updated successfully!');
          this.feedbackForm.reset({ rating: 5 });
          this.editingFeedbackId = null;
          this.loadMyFeedback();
          this.loading = false;
        },
        error: (error) => {
          this.notificationService.error(error.error?.message || 'Failed to update feedback. You can only edit within 24 hours.');
          this.loading = false;
        }
      });
    } else {
      // Create new feedback
      this.feedbackService.createFeedback(this.feedbackForm.value).subscribe({
        next: (response) => {
          this.notificationService.success('Thank you for your feedback!');
          this.feedbackForm.reset({ rating: 5 });
          this.loadMyFeedback();
          this.loading = false;
        },
        error: (error) => {
          this.notificationService.error(error.error?.message || 'Failed to submit feedback. You can only submit once per day.');
          this.loading = false;
        }
      });
    }
  }

  editFeedback(feedback: any): void {
    const createdAt = new Date(feedback.created_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursDiff >= 24) {
      this.notificationService.error('You can only edit feedback within 24 hours of submission.');
      return;
    }

    this.editingFeedbackId = feedback.id;
    this.feedbackForm.patchValue({
      rating: feedback.rating,
      department: feedback.department,
      comment: feedback.comment
    });
    this.error = '';
    this.success = '';
  }

  cancelEdit(): void {
    this.editingFeedbackId = null;
    this.feedbackForm.reset({ rating: 5 });
    this.error = '';
    this.success = '';
  }

  canEdit(feedback: any): boolean {
    const createdAt = new Date(feedback.created_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24;
  }

  getRatingStars(rating: number): string {
    return '⭐'.repeat(rating);
  }
}
