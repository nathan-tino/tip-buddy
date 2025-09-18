import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError, Subject } from 'rxjs';
import { HeaderComponent } from './header.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
	let component: HeaderComponent;
	let fixture: ComponentFixture<HeaderComponent>;
	let authServiceSpy: jasmine.SpyObj<AuthService>;
	let routerSpy: jasmine.SpyObj<Router>;
	let isLoggedInSubject: Subject<boolean>;

	beforeEach(async () => {
		authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
			isLoggedIn$: new Subject<boolean>()
		});
		routerSpy = jasmine.createSpyObj('Router', ['navigate']);
		isLoggedInSubject = authServiceSpy.isLoggedIn$ as Subject<boolean>;

		await TestBed.configureTestingModule({
			imports: [HeaderComponent],
			providers: [
				provideHttpClient(),
				{ provide: AuthService, useValue: authServiceSpy },
				{ provide: Router, useValue: routerSpy }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(HeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should update isLoggedIn when AuthService emits', () => {
		isLoggedInSubject.next(true);
		expect(component.isLoggedIn).toBeTrue();
		isLoggedInSubject.next(false);
		expect(component.isLoggedIn).toBeFalse();
	});

	it('should call AuthService.logout and navigate to /login on success', () => {
		authServiceSpy.logout.and.returnValue(of(undefined));
		component.logout();
		expect(authServiceSpy.logout).toHaveBeenCalled();
		expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
	});

	it('should navigate to /login on logout error', () => {
		authServiceSpy.logout.and.returnValue(throwError(() => new Error('Logout error')));
		component.logout();
		expect(authServiceSpy.logout).toHaveBeenCalled();
		expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
	});

	it('should complete destroy$ on ngOnDestroy', () => {
		spyOn((component as any).destroy$, 'next');
		spyOn((component as any).destroy$, 'complete');
		component.ngOnDestroy();
		expect((component as any).destroy$.next).toHaveBeenCalled();
		expect((component as any).destroy$.complete).toHaveBeenCalled();
	});
});
