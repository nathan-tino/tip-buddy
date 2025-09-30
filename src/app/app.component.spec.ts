import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { HeaderComponent } from './header/header.component';
import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { AuthResponse } from './dtos/auth-response.dto';

// Mock components
@Component({
  selector: 'app-header',
  template: '<div>Mock Header</div>',
  standalone: true
})
class MockHeaderComponent { }

@Component({
  selector: 'router-outlet',
  template: '<div>Mock Router Outlet</div>',
  standalone: true
})
class MockRouterOutlet { }

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create spy objects for dependencies
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['verifySession']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'], {
      url: '/some-route'
    });

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .overrideComponent(AppComponent, {
      remove: { imports: [HeaderComponent, RouterOutlet] },
      add: { imports: [MockHeaderComponent, MockRouterOutlet] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Set default return value for verifySession to prevent undefined errors
    const mockAuthResponse: AuthResponse = {
      message: 'Session valid',
      isDemo: false
    };
    authService.verifySession.and.returnValue(of(mockAuthResponse));

    // Mock console.log to avoid test output pollution
    spyOn(console, 'log');
  });

  describe('Component Creation and Rendering', () => {
    it('should create the app', () => {
      expect(component).toBeTruthy();
    });

    it('should render the header component', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('app-header')).toBeTruthy();
    });

    it('should render the router outlet', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('router-outlet')).toBeTruthy();
    });

    it('should have the correct app-container structure', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const container = compiled.querySelector('.app-container');
      expect(container).toBeTruthy();
      expect(container?.querySelector('app-header')).toBeTruthy();
      expect(container?.querySelector('main router-outlet')).toBeTruthy();
    });
  });

  describe('ngOnInit - Session Verification', () => {
    it('should verify session on initialization', () => {
      // Arrange
      const mockAuthResponse: AuthResponse = {
        message: 'Session valid',
        isDemo: false
      };
      authService.verifySession.and.returnValue(of(mockAuthResponse));

      // Act
      component.ngOnInit();

      // Assert
      expect(authService.verifySession).toHaveBeenCalledTimes(1);
    });

    it('should log success message when session verification succeeds', () => {
      // Arrange
      const mockAuthResponse: AuthResponse = {
        message: 'Session valid',
        isDemo: false
      };
      authService.verifySession.and.returnValue(of(mockAuthResponse));

      // Act
      component.ngOnInit();

      // Assert
      expect(console.log).toHaveBeenCalledWith('User session verified');
    });

    it('should redirect from login to shifts when session is valid and currently on login page', () => {
      // Arrange
      const mockAuthResponse: AuthResponse = {
        message: 'Session valid',
        isDemo: false
      };
      authService.verifySession.and.returnValue(of(mockAuthResponse));
      Object.defineProperty(router, 'url', { value: '/login', configurable: true });

      // Act
      component.ngOnInit();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith(['/shifts']);
    });

    it('should not redirect when session is valid but not on login page', () => {
      // Arrange
      const mockAuthResponse: AuthResponse = {
        message: 'Session valid',
        isDemo: false
      };
      authService.verifySession.and.returnValue(of(mockAuthResponse));
      Object.defineProperty(router, 'url', { value: '/shifts', configurable: true });

      // Act
      component.ngOnInit();

      // Assert
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle demo user session verification', () => {
      // Arrange
      const mockAuthResponse: AuthResponse = {
        message: 'Demo session valid',
        isDemo: true
      };
      authService.verifySession.and.returnValue(of(mockAuthResponse));
      Object.defineProperty(router, 'url', { value: '/login', configurable: true });

      // Act
      component.ngOnInit();

      // Assert
      expect(console.log).toHaveBeenCalledWith('User session verified');
      expect(router.navigate).toHaveBeenCalledWith(['/shifts']);
    });
  });

  describe('ngOnInit - Session Verification Failure', () => {
    it('should log error message when session verification fails', () => {
      // Arrange
      const mockError = new Error('Session expired');
      authService.verifySession.and.returnValue(throwError(() => mockError));

      // Act
      component.ngOnInit();

      // Assert
      expect(console.log).toHaveBeenCalledWith('Session verification failed:', mockError);
    });

    it('should redirect to login when session verification fails and not on login/register page', () => {
      // Arrange
      const mockError = new Error('Session expired');
      authService.verifySession.and.returnValue(throwError(() => mockError));
      Object.defineProperty(router, 'url', { value: '/shifts', configurable: true });

      // Act
      component.ngOnInit();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should not redirect when session verification fails but already on login page', () => {
      // Arrange
      const mockError = new Error('Session expired');
      authService.verifySession.and.returnValue(throwError(() => mockError));
      Object.defineProperty(router, 'url', { value: '/login', configurable: true });

      // Act
      component.ngOnInit();

      // Assert
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should not redirect when session verification fails but already on register page', () => {
      // Arrange
      const mockError = new Error('Session expired');
      authService.verifySession.and.returnValue(throwError(() => mockError));
      Object.defineProperty(router, 'url', { value: '/register', configurable: true });

      // Act
      component.ngOnInit();

      // Assert
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle HTTP error responses during session verification', () => {
      // Arrange
      const httpError = {
        status: 401,
        statusText: 'Unauthorized',
        error: { message: 'Token expired' }
      };
      authService.verifySession.and.returnValue(throwError(() => httpError));
      Object.defineProperty(router, 'url', { value: '/dashboard', configurable: true });

      // Act
      component.ngOnInit();

      // Assert
      expect(console.log).toHaveBeenCalledWith('Session verification failed:', httpError);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle network errors during session verification', () => {
      // Arrange
      const networkError = {
        status: 0,
        statusText: 'Unknown Error',
        error: 'Network error'
      };
      authService.verifySession.and.returnValue(throwError(() => networkError));
      Object.defineProperty(router, 'url', { value: '/some-protected-route', configurable: true });

      // Act
      component.ngOnInit();

      // Assert
      expect(console.log).toHaveBeenCalledWith('Session verification failed:', networkError);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty or root URL correctly', () => {
      // Arrange
      const mockError = new Error('Session expired');
      authService.verifySession.and.returnValue(throwError(() => mockError));
      Object.defineProperty(router, 'url', { value: '/', configurable: true });

      // Act
      component.ngOnInit();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle URL with query parameters correctly', () => {
      // Arrange
      const mockError = new Error('Session expired');
      authService.verifySession.and.returnValue(throwError(() => mockError));
      // URL with query parameters is not exactly '/login' or '/register', so should redirect
      Object.defineProperty(router, 'url', { value: '/login?returnUrl=/shifts', configurable: true });

      // Act
      component.ngOnInit();

      // Assert
      // Since '/login?returnUrl=/shifts' is not exactly '/login', it should redirect
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle URL with fragments correctly', () => {
      // Arrange
      const mockAuthResponse: AuthResponse = {
        message: 'Session valid',
        isDemo: false
      };
      authService.verifySession.and.returnValue(of(mockAuthResponse));
      // URL with fragment is not exactly '/login', so no redirect should happen on success
      Object.defineProperty(router, 'url', { value: '/login#section', configurable: true });

      // Act
      component.ngOnInit();

      // Assert
      // Since '/login#section' is not exactly '/login', no redirect should happen
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle register URL with additional path segments', () => {
      // Arrange
      const mockError = new Error('Session expired');
      authService.verifySession.and.returnValue(throwError(() => mockError));
      Object.defineProperty(router, 'url', { value: '/register/confirm', configurable: true });

      // Act
      component.ngOnInit();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
