import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';

const apiBaseUrl = environment.apiBaseUrl;

describe('AuthService', () => {
	let service: AuthService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [AuthService]
		});
		service = TestBed.inject(AuthService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should login and set isLoggedIn$ to true on success', () => {
		const dto: LoginDto = { userName: 'user', password: 'pass' };
		let loggedIn: boolean | undefined;
		service.isLoggedIn$.subscribe(val => loggedIn = val);
		service.login(dto).subscribe();
		const req = httpMock.expectOne(`${apiBaseUrl}/auth/login`);
		expect(req.request.method).toBe('POST');
		req.flush({});
		expect(loggedIn).toBeTrue();
	});

	it('should set isLoggedIn$ to false on login error', () => {
		const dto: LoginDto = { userName: 'user', password: 'pass' };
		let loggedIn: boolean | undefined;
		service.isLoggedIn$.subscribe(val => loggedIn = val);
		service.login(dto).subscribe({
			error: () => {
				expect(loggedIn).toBeFalse();
			}
		});
		const req = httpMock.expectOne(`${apiBaseUrl}/auth/login`);
		req.flush('error', { status: 401, statusText: 'Unauthorized' });
	});

	it('should register user', () => {
		const dto: RegisterDto = {
			userName: 'user',
			password: 'pass',
			email: 'test@test.com',
			firstName: 'Test',
			lastName: 'User'
		};
		service.register(dto).subscribe(res => {
			expect(res).toBeTruthy();
		});
		const req = httpMock.expectOne(`${apiBaseUrl}/auth/register`);
		expect(req.request.method).toBe('POST');
		req.flush({});
	});

	it('should logout and set isLoggedIn$ to false', () => {
		let loggedIn: boolean | undefined;
		service.isLoggedIn$.subscribe(val => loggedIn = val);
		service.logout().subscribe(res => {
			expect(res).toBeTruthy();
			expect(loggedIn).toBeFalse();
		});
		const req = httpMock.expectOne(`${apiBaseUrl}/auth/logout`);
		expect(req.request.method).toBe('POST');
		req.flush({});
	});

	it('should demo login and set isLoggedIn$ to true on success', () => {
		let loggedIn: boolean | undefined;
		service.isLoggedIn$.subscribe(val => loggedIn = val);
		service.demoLogin().subscribe(res => {
			expect(res).toBeTruthy();
			expect(loggedIn).toBeTrue();
		});
		const req = httpMock.expectOne(`${apiBaseUrl}/auth/demo`);
		expect(req.request.method).toBe('POST');
		expect(req.request.body).toEqual({});
		expect(req.request.withCredentials).toBeTrue();
		req.flush({});
	});

	it('should set isLoggedIn$ to false on demo login error', () => {
		let loggedIn: boolean | undefined;
		service.isLoggedIn$.subscribe(val => loggedIn = val);
		service.demoLogin().subscribe({
			error: () => {
				expect(loggedIn).toBeFalse();
			}
		});
		const req = httpMock.expectOne(`${apiBaseUrl}/auth/demo`);
		req.flush('error', { status: 500, statusText: 'Internal Server Error' });
	});

	it('should call the correct demo endpoint with credentials', () => {
		service.demoLogin().subscribe();
		const req = httpMock.expectOne(`${apiBaseUrl}/auth/demo`);
		expect(req.request.method).toBe('POST');
		expect(req.request.withCredentials).toBeTrue();
		expect(req.request.body).toEqual({});
		req.flush({});
	});

	it('should set isDemoUser$ to true on demo login success', () => {
		let isDemoUser: boolean | undefined;
		service.isDemoUser$.subscribe(val => isDemoUser = val);
		service.demoLogin().subscribe();
		const req = httpMock.expectOne(`${apiBaseUrl}/auth/demo`);
		req.flush({});
		expect(isDemoUser).toBeTrue();
	});

	it('should set isDemoUser$ to false on demo login error', () => {
		let isDemoUser: boolean | undefined;
		service.isDemoUser$.subscribe(val => isDemoUser = val);
		service.demoLogin().subscribe({
			error: () => {
				expect(isDemoUser).toBeFalse();
			}
		});
		const req = httpMock.expectOne(`${apiBaseUrl}/auth/demo`);
		req.flush('error', { status: 500, statusText: 'Internal Server Error' });
	});

	it('should set isDemoUser$ to false on regular login', () => {
		const dto: LoginDto = { userName: 'user', password: 'pass' };
		let isDemoUser: boolean | undefined;
		service.isDemoUser$.subscribe(val => isDemoUser = val);
		service.login(dto).subscribe();
		const req = httpMock.expectOne(`${apiBaseUrl}/auth/login`);
		req.flush({});
		expect(isDemoUser).toBeFalse();
	});

	it('should set isDemoUser$ to false on logout', () => {
		let isDemoUser: boolean | undefined;
		service.isDemoUser$.subscribe(val => isDemoUser = val);
		service.logout().subscribe();
		const req = httpMock.expectOne(`${apiBaseUrl}/auth/logout`);
		req.flush({});
		expect(isDemoUser).toBeFalse();
	});
});