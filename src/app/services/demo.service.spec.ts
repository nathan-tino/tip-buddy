import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DemoService } from './demo.service';
import { environment } from '../../environments/environment';

const apiBaseUrl = environment.apiBaseUrl;

describe('DemoService', () => {
	let service: DemoService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [DemoService]
		});
		service = TestBed.inject(DemoService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should reset demo shifts successfully', () => {
		service.resetDemoShifts().subscribe(res => {
			expect(res).toBeTruthy();
		});
		const req = httpMock.expectOne(`${apiBaseUrl}/demodata/reset-shifts`);
		expect(req.request.method).toBe('POST');
		expect(req.request.withCredentials).toBeTrue();
		expect(req.request.body).toEqual({});
		req.flush({});
	});

	it('should handle reset demo shifts error', () => {
		service.resetDemoShifts().subscribe({
			next: () => fail('Should have failed'),
			error: (err) => {
				expect(err).toBeTruthy();
			}
		});
		const req = httpMock.expectOne(`${apiBaseUrl}/demodata/reset-shifts`);
		req.flush('error', { status: 500, statusText: 'Internal Server Error' });
	});
});