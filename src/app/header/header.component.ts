import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DemoService } from '../services/demo.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  imports: [ButtonModule, StyleClassModule]
})
export class HeaderComponent implements OnDestroy {
  isLoggedIn = false;
  isDemoUser = false;

  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private demoService: DemoService, private router: Router) {
    this.authService.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.isLoggedIn = val;
      });

    this.authService.isDemoUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.isDemoUser = val;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.authService.logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.router.navigate(['/login']);
        }
      });
  }

  resetDemoShifts() {
    this.demoService.resetDemoShifts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Optionally show a success message or refresh the page
          window.location.reload();
        },
        error: (err) => {
          console.error('Failed to reset demo shifts:', err);
          // Optionally show an error message
        }
      });
  }
}
