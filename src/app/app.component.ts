import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

import { HeaderComponent } from './header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Verify session on app initialization
    this.authService.verifySession().subscribe({
      next: () => {
        // Session is valid, user is authenticated
        console.log('User session verified');
      },
      error: (err) => {
        // Session is invalid or expired, user is not authenticated
        console.log('Session verification failed:', err);
      }
    });
  }
}
