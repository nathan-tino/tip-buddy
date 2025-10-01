import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { AuthResponse } from '../dtos/auth-response.dto';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let isLoggedInSubject: BehaviorSubject<boolean>;

  beforeEach(() => {
    // Create a BehaviorSubject to control the isLoggedIn$ observable
    isLoggedInSubject = new BehaviorSubject<boolean>(false);

    // Create spy objects for dependencies
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['verifySession'], {
      isLoggedIn$: isLoggedInSubject.asObservable()
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    // Clean up the subject after each test
    isLoggedInSubject.complete();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return true when user is already logged in', (done: DoneFn) => {
      // Arrange
      isLoggedInSubject.next(true);

      // Act
      guard.canActivate().subscribe(result => {
        // Assert
        expect(result).toBe(true);
        expect(authService.verifySession).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      });
    });

    it('should return true when user is not logged in but session verification succeeds', (done: DoneFn) => {
      // Arrange
      isLoggedInSubject.next(false);
      const mockAuthResponse: AuthResponse = {
        message: 'Session valid',
        isDemo: false
      };
      authService.verifySession.and.returnValue(of(mockAuthResponse));

      // Act
      guard.canActivate().subscribe(result => {
        // Assert
        expect(result).toBe(true);
        expect(authService.verifySession).toHaveBeenCalledTimes(1);
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      });
    });

    it('should return false and redirect to login when user is not logged in and session verification fails', (done: DoneFn) => {
      // Arrange
      isLoggedInSubject.next(false);
      const mockError = new Error('Session expired');
      authService.verifySession.and.returnValue(throwError(() => mockError));

      // Act
      guard.canActivate().subscribe(result => {
        // Assert
        expect(result).toBe(false);
        expect(authService.verifySession).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    });

    it('should handle HTTP error responses during session verification', (done: DoneFn) => {
      // Arrange
      isLoggedInSubject.next(false);
      const httpError = {
        status: 401,
        statusText: 'Unauthorized',
        error: { message: 'Token expired' }
      };
      authService.verifySession.and.returnValue(throwError(() => httpError));

      // Act
      guard.canActivate().subscribe(result => {
        // Assert
        expect(result).toBe(false);
        expect(authService.verifySession).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    });

    it('should take only one value from isLoggedIn$ observable', (done: DoneFn) => {
      // Arrange
      isLoggedInSubject.next(true);

      // Act
      guard.canActivate().subscribe(result => {
        // Assert
        expect(result).toBe(true);
        
        // Change the subject value after subscription
        isLoggedInSubject.next(false);
        
        // The guard should not react to this change because of take(1)
        expect(authService.verifySession).not.toHaveBeenCalled();
        done();
      });
    });

    it('should handle demo user session verification successfully', (done: DoneFn) => {
      // Arrange
      isLoggedInSubject.next(false);
      const mockAuthResponse: AuthResponse = {
        message: 'Demo session valid',
        isDemo: true
      };
      authService.verifySession.and.returnValue(of(mockAuthResponse));

      // Act
      guard.canActivate().subscribe(result => {
        // Assert
        expect(result).toBe(true);
        expect(authService.verifySession).toHaveBeenCalledTimes(1);
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      });
    });

    it('should navigate to login page when session verification returns network error', (done: DoneFn) => {
      // Arrange
      isLoggedInSubject.next(false);
      const networkError = {
        status: 0,
        statusText: 'Unknown Error',
        error: 'Network error'
      };
      authService.verifySession.and.returnValue(throwError(() => networkError));

      // Act
      guard.canActivate().subscribe(result => {
        // Assert
        expect(result).toBe(false);
        expect(authService.verifySession).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    });

    it('should complete the observable after processing', (done: DoneFn) => {
      // Arrange
      isLoggedInSubject.next(true);
      let completed = false;

      // Act
      guard.canActivate().subscribe({
        next: (result) => {
          expect(result).toBe(true);
        },
        complete: () => {
          completed = true;
          // Assert
          expect(completed).toBe(true);
          done();
        }
      });
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle undefined response from verifySession', (done: DoneFn) => {
      // Arrange
      isLoggedInSubject.next(false);
      authService.verifySession.and.returnValue(of(undefined as any));

      // Act
      guard.canActivate().subscribe(result => {
        // Assert
        expect(result).toBe(true);
        expect(authService.verifySession).toHaveBeenCalledTimes(1);
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      });
    });

    it('should handle null response from verifySession', (done: DoneFn) => {
      // Arrange
      isLoggedInSubject.next(false);
      authService.verifySession.and.returnValue(of(null as any));

      // Act
      guard.canActivate().subscribe(result => {
        // Assert
        expect(result).toBe(true);
        expect(authService.verifySession).toHaveBeenCalledTimes(1);
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      });
    });
  });
});