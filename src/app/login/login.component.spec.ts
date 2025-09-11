import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

class MockAuthService {
	login() {
		return { subscribe: () => { } };
	}
}

class MockRouter {
	events = new Subject<any>();
	navigate(path: string[]) { }
	createUrlTree(commands: any[], navigationExtras?: any) {
		return {};
	}
	serializeUrl(url: any) {
		return '';
	}
}

class MockActivatedRoute { }

describe('LoginComponent', () => {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormsModule, HttpClientTestingModule, LoginComponent],
			providers: [
				{ provide: AuthService, useClass: MockAuthService },
				{ provide: Router, useClass: MockRouter },
				{ provide: ActivatedRoute, useClass: MockActivatedRoute }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have empty username and password by default', () => {
		expect(component.userName).toBe('');
		expect(component.password).toBe('');
	});

	it('should call login method on form submit', async () => {
		spyOn(component, 'login');
		const form = fixture.nativeElement.querySelector('form');
		form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
		await fixture.whenStable();
		fixture.detectChanges();
		expect(component.login).toHaveBeenCalled();
	});

	it('should call AuthService.login with correct credentials and navigate on success', () => {
		const authService = TestBed.inject(AuthService) as any;
		const router = TestBed.inject(Router) as any;
		spyOn(authService, 'login').and.returnValue({ subscribe: (handlers: any) => handlers.next({}) });
		spyOn(router, 'navigate');
		component.userName = 'testuser';
		component.password = 'testpass';
		component.login();
		expect(authService.login).toHaveBeenCalledWith({ userName: 'testuser', password: 'testpass' });
		expect(router.navigate).toHaveBeenCalledWith(['/shifts']);
		expect(component.error).toBeNull();
	});

	it('should set error message on AuthService.login error', () => {
		const authService = TestBed.inject(AuthService) as any;
		spyOn(authService, 'login').and.returnValue({ subscribe: (handlers: any) => handlers.error({ error: { message: 'Invalid credentials' } }) });
		component.userName = 'baduser';
		component.password = 'badpass';
		component.login();
		expect(authService.login).toHaveBeenCalledWith({ userName: 'baduser', password: 'badpass' });
		expect(component.error).toBe('Invalid credentials');
	});
});
