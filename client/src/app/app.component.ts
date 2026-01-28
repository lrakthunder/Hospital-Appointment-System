import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-notification></app-notification>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Hospital Appointment Booking System';
}
