import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { EditShiftComponent } from './edit-shift.component';
import { ShiftService } from '../../services/shift.service';
import { DateService } from '../../services/date.service';
import { ShiftFormComponent } from '../shift-form/shift-form.component';
import { ShiftFormModel } from '../shift-form/shift-form.model';
import { GetShiftDto } from '../../dtos/get-shift.dto';

describe('EditShiftComponent', () => {
	let component: EditShiftComponent;
	let fixture: ComponentFixture<EditShiftComponent>;
	let shiftServiceSpy: jasmine.SpyObj<ShiftService>;
	let dateServiceSpy: jasmine.SpyObj<DateService>;

	beforeEach(async () => {
		const shiftServiceMock = jasmine.createSpyObj('ShiftService', ['editShift']);
		const dateServiceMock = jasmine.createSpyObj('DateService', ['convertStringToUtcDate', 'combineDateAndTimeObjects', 'splitLocalDateTimeIntoComponents']);

		await TestBed.configureTestingModule({
			imports: [EditShiftComponent],
			providers: [
				{ provide: ShiftService, useValue: shiftServiceMock },
				{ provide: DateService, useValue: dateServiceMock }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(EditShiftComponent);
		component = fixture.componentInstance;
		shiftServiceSpy = TestBed.inject(ShiftService) as jasmine.SpyObj<ShiftService>;
		dateServiceSpy = TestBed.inject(DateService) as jasmine.SpyObj<DateService>;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize dateInput and timeInput from shift.date', () => {
		const testShift: GetShiftDto = {
			id: '1',
			creditTips: 100,
			cashTips: 50,
			tipout: 20,
			date: new Date('2023-08-28T14:30:00Z'),
			hoursWorked: 8
		};

		// Mock the return value of splitLocalDateTimeIntoComponents
		const expectedLocalDate = new Date(2023, 7, 28); // August 28, 2023 (month is 0-based)
		const expectedLocalTime = new Date();
		expectedLocalTime.setHours(14, 30, 0, 0);

		dateServiceSpy.splitLocalDateTimeIntoComponents.and.returnValue({
			localDate: expectedLocalDate,
			localTime: expectedLocalTime
		});

		component.shift = testShift;
		component.ngOnInit();

		// Verify the method was called with the shift's date
		expect(dateServiceSpy.splitLocalDateTimeIntoComponents).toHaveBeenCalledWith(testShift.date);

		// Verify the component properties were set correctly
		expect(component.dateInput).toBe(expectedLocalDate);
		expect(component.timeInput).toBe(expectedLocalTime);
	});

	it('should not initialize dateInput and timeInput when component is created without shift input', () => {
		// Test the component in its initial state before shift input is set
		// This simulates the real scenario where the component is created but
		// the parent hasn't passed the shift input yet
		const freshFixture = TestBed.createComponent(EditShiftComponent);
		const freshComponent = freshFixture.componentInstance;

		// Call ngOnInit without setting shift first
		freshComponent.ngOnInit();

		// The guard clause should prevent initialization
		expect(freshComponent.dateInput).toBeUndefined();
		expect(freshComponent.timeInput).toBeUndefined();
		expect(dateServiceSpy.splitLocalDateTimeIntoComponents).not.toHaveBeenCalled();
	});

	it('should emit undefined on cancel', () => {
		spyOn(component.close, 'emit');
		component.onCancel();
		expect(component.close.emit).toHaveBeenCalledWith(undefined);
	});

	it('should call editShift and emit updated shift on submit', fakeAsync(() => {
		const testShift: GetShiftDto = {
			id: '1',
			creditTips: 100,
			cashTips: 50,
			tipout: 20,
			date: new Date('2023-08-28T14:30:00Z'),
			hoursWorked: 8
		};
		component.shift = testShift;

		const shiftModel: ShiftFormModel = {
			creditTips: 150,
			cashTips: 75,
			tipout: 30,
			date: new Date('2023-08-29'),
			time: new Date('1970-01-01T15:00:00Z'),
			hoursWorked: 9
		};
		const convertedDate = new Date('2023-08-29T15:00:00Z');
		const updatedShift: GetShiftDto = {
			id: '1',
			creditTips: 150,
			cashTips: 75,
			tipout: 30,
			date: convertedDate,
			hoursWorked: 9
		};

		dateServiceSpy.combineDateAndTimeObjects.and.returnValue(convertedDate);
		shiftServiceSpy.editShift.and.returnValue(of(undefined));
		spyOn(component.close, 'emit');

		component.onSubmit(shiftModel);
		tick(); // Process the observable

		expect(dateServiceSpy.combineDateAndTimeObjects).toHaveBeenCalledWith(shiftModel.date, shiftModel.time);
		expect(shiftServiceSpy.editShift).toHaveBeenCalledWith('1', {
			id: '1',
			creditTips: 150,
			cashTips: 75,
			tipout: 30,
			date: convertedDate,
			hoursWorked: 9
		});
		expect(component.close.emit).toHaveBeenCalledWith({
			id: '1',
			creditTips: 150,
			cashTips: 75,
			tipout: 30,
			date: convertedDate,
			hoursWorked: 9
		});
	}));

	it('should handle error on submit', fakeAsync(() => {
		const testShift: GetShiftDto = {
			id: '1',
			creditTips: 100,
			cashTips: 50,
			tipout: 20,
			date: new Date('2023-08-28T14:30:00Z'),
			hoursWorked: 8
		};
		component.shift = testShift;

		const shiftModel: ShiftFormModel = {
			creditTips: 150,
			cashTips: 75,
			tipout: 30,
			date: new Date('2023-08-29'),
			time: new Date('1970-01-01T15:00:00Z'),
			hoursWorked: 9
		};
		const convertedDate = new Date('2023-08-29T15:00:00Z');
		const error = new Error('Edit failed');

		dateServiceSpy.combineDateAndTimeObjects.and.returnValue(convertedDate);
		shiftServiceSpy.editShift.and.returnValue(throwError(() => error));
		spyOn(console, 'error');
		spyOn(component.close, 'emit');

		component.onSubmit(shiftModel);
		tick(); // Process the observable

		expect(console.error).toHaveBeenCalled();
		expect(component.close.emit).not.toHaveBeenCalled();
	}));

	it('should convert undefined tip values to 0 using nullish coalescing operator', fakeAsync(() => {
		const testShift: GetShiftDto = {
			id: '1',
			creditTips: 100,
			cashTips: 50,
			tipout: 20,
			date: new Date('2023-08-28T14:30:00Z'),
			hoursWorked: 8
		};
		component.shift = testShift;

		const shiftModel: ShiftFormModel = {
			creditTips: undefined,
			cashTips: undefined,
			tipout: undefined,
			date: new Date('2023-08-29'),
			time: new Date('1970-01-01T15:00:00Z'),
			hoursWorked: 9
		};
		const convertedDate = new Date('2023-08-29T15:00:00Z');

		dateServiceSpy.combineDateAndTimeObjects.and.returnValue(convertedDate);
		shiftServiceSpy.editShift.and.returnValue(of(undefined));
		spyOn(component.close, 'emit');

		component.onSubmit(shiftModel);
		tick();

		// Verify that the component correctly converts undefined values to 0
		// using the nullish coalescing operator (??) in the onSubmit method
		expect(shiftServiceSpy.editShift).toHaveBeenCalledWith('1', {
			id: '1',
			creditTips: 0, // undefined → 0 via ?? operator
			cashTips: 0,   // undefined → 0 via ?? operator
			tipout: 0,     // undefined → 0 via ?? operator
			date: convertedDate,
			hoursWorked: 9
		});
		expect(component.close.emit).toHaveBeenCalledWith({
			id: '1',
			creditTips: 0,
			cashTips: 0,
			tipout: 0,
			date: convertedDate,
			hoursWorked: 9
		});
	}));

	it('should preserve defined tip values and convert null to 0', fakeAsync(() => {
		const testShift: GetShiftDto = {
			id: '1',
			creditTips: 100,
			cashTips: 50,
			tipout: 20,
			date: new Date('2023-08-28T14:30:00Z'),
			hoursWorked: 8
		};
		component.shift = testShift;

		const shiftModel: ShiftFormModel = {
			creditTips: 75,        // defined value should be preserved
			cashTips: undefined,   // undefined should become 0
			tipout: 25,           // defined value should be preserved
			date: new Date('2023-08-29'),
			time: new Date('1970-01-01T15:00:00Z'),
			hoursWorked: 9
		};
		const convertedDate = new Date('2023-08-29T15:00:00Z');

		dateServiceSpy.combineDateAndTimeObjects.and.returnValue(convertedDate);
		shiftServiceSpy.editShift.and.returnValue(of(undefined));
		spyOn(component.close, 'emit');

		component.onSubmit(shiftModel);
		tick();

		// Verify that defined values are preserved and only undefined/null are converted to 0
		expect(shiftServiceSpy.editShift).toHaveBeenCalledWith('1', {
			id: '1',
			creditTips: 75, // preserved defined value
			cashTips: 0,    // undefined → 0 via ?? operator
			tipout: 25,     // preserved defined value
			date: convertedDate,
			hoursWorked: 9
		});
	}));
});