import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AddShiftComponent } from './add-shift.component';
import { ShiftService } from '../../services/shift.service';
import { DateService } from '../../services/date.service';
import { ShiftFormComponent } from '../shift-form/shift-form.component';
import { ShiftFormModel } from '../shift-form/shift-form.model';
import { GetShiftDto } from '../../dtos/get-shift.dto';
import { CreateShiftDto } from '../../dtos/create-shift.dto';

describe('AddShiftComponent', () => {
	let component: AddShiftComponent;
	let fixture: ComponentFixture<AddShiftComponent>;
	let shiftServiceSpy: jasmine.SpyObj<ShiftService>;
	let dateServiceSpy: jasmine.SpyObj<DateService>;

	beforeEach(async () => {
	const shiftServiceMock = jasmine.createSpyObj('ShiftService', ['addShift']);
	const dateServiceMock = jasmine.createSpyObj('DateService', ['convertStringToUtcDate', 'combineDateAndTimeObjects']);

		await TestBed.configureTestingModule({
			imports: [AddShiftComponent],
			providers: [
				{ provide: ShiftService, useValue: shiftServiceMock },
				{ provide: DateService, useValue: dateServiceMock }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(AddShiftComponent);
		component = fixture.componentInstance;
		shiftServiceSpy = TestBed.inject(ShiftService) as jasmine.SpyObj<ShiftService>;
		dateServiceSpy = TestBed.inject(DateService) as jasmine.SpyObj<DateService>;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize dateInput when shiftDate is provided', () => {
		const testDate = new Date('2023-08-28T00:00:00Z');
		component.shiftDate = testDate;
		component.ngOnInit();
		expect(component.dateInput.toISOString().slice(0, 10)).toBe('2023-08-28');
	});

	it('should set hoursWorkedInput to undefined on init', () => {
		component.ngOnInit();
		expect(component.hoursWorkedInput).toBeUndefined();
	});

	it('should emit undefined on cancel', () => {
		spyOn(component.close, 'emit');
		component.onCancel();
		expect(component.close.emit).toHaveBeenCalledWith(undefined);
	});

	it('should call addShift and emit created shift on submit', () => {
		const shiftModel: ShiftFormModel = {
			creditTips: 100,
			cashTips: 50,
			tipout: 20,
			date: new Date('2023-08-28'),
			time: new Date('1970-01-01T14:30:00Z'),
			hoursWorked: 8
		};
		const createdShift: GetShiftDto = {
			id: '1',
			creditTips: 100,
			cashTips: 50,
			tipout: 20,
			date: new Date('2023-08-28T14:30:00Z'),
			hoursWorked: 8
		};
		const convertedDate = new Date('2023-08-28T14:30:00Z');

	dateServiceSpy.combineDateAndTimeObjects.and.returnValue(convertedDate);
		shiftServiceSpy.addShift.and.returnValue(of(createdShift));
		spyOn(component.close, 'emit');

		component.onSubmit(shiftModel);

		expect(dateServiceSpy.combineDateAndTimeObjects).toHaveBeenCalledWith(shiftModel.date, shiftModel.time);
		expect(shiftServiceSpy.addShift).toHaveBeenCalledWith({
			creditTips: 100,
			cashTips: 50,
			tipout: 20,
			date: convertedDate,
			hoursWorked: 8
		} as CreateShiftDto);
		expect(component.close.emit).toHaveBeenCalledWith(createdShift);
	});

	it('should default creditTips, cashTips, and tipout to 0 when undefined', () => {
		const shiftModel: ShiftFormModel = {
			creditTips: undefined,
			cashTips: undefined,
			tipout: undefined,
			date: new Date('2023-08-28'),
			time: new Date('1970-01-01T14:30:00Z'),
			hoursWorked: 8
		};
		const createdShift: GetShiftDto = {
			id: '1',
			creditTips: 0,
			cashTips: 0,
			tipout: 0,
			date: new Date('2023-08-28T14:30:00Z'),
			hoursWorked: 8
		};
		const convertedDate = new Date('2023-08-28T14:30:00Z');

		dateServiceSpy.combineDateAndTimeObjects.and.returnValue(convertedDate);
		shiftServiceSpy.addShift.and.returnValue(of(createdShift));
		spyOn(component.close, 'emit');

		component.onSubmit(shiftModel);

		expect(shiftServiceSpy.addShift).toHaveBeenCalledWith({
			creditTips: 0,
			cashTips: 0,
			tipout: 0,
			date: convertedDate,
			hoursWorked: 8
		} as CreateShiftDto);
		expect(component.close.emit).toHaveBeenCalledWith(createdShift);
	});

	it('should default creditTips, cashTips, and tipout to 0 when null', () => {
		const shiftModel: ShiftFormModel = {
			creditTips: null as any,
			cashTips: null as any,
			tipout: null as any,
			date: new Date('2023-08-28'),
			time: new Date('1970-01-01T14:30:00Z'),
			hoursWorked: 8
		};
		const createdShift: GetShiftDto = {
			id: '1',
			creditTips: 0,
			cashTips: 0,
			tipout: 0,
			date: new Date('2023-08-28T14:30:00Z'),
			hoursWorked: 8
		};
		const convertedDate = new Date('2023-08-28T14:30:00Z');

		dateServiceSpy.combineDateAndTimeObjects.and.returnValue(convertedDate);
		shiftServiceSpy.addShift.and.returnValue(of(createdShift));
		spyOn(component.close, 'emit');

		component.onSubmit(shiftModel);

		expect(shiftServiceSpy.addShift).toHaveBeenCalledWith({
			creditTips: 0,
			cashTips: 0,
			tipout: 0,
			date: convertedDate,
			hoursWorked: 8
		} as CreateShiftDto);
		expect(component.close.emit).toHaveBeenCalledWith(createdShift);
	});

	it('should handle addShift error and log to console', () => {
		const shiftModel: ShiftFormModel = {
			creditTips: 100,
			cashTips: 50,
			tipout: 20,
			date: new Date('2023-08-28'),
			time: new Date('1970-01-01T14:30:00Z'),
			hoursWorked: 8
		};
		const convertedDate = new Date('2023-08-28T14:30:00Z');
		const error = new Error('Test error');

		dateServiceSpy.combineDateAndTimeObjects.and.returnValue(convertedDate);
		shiftServiceSpy.addShift.and.returnValue(throwError(() => error));
		spyOn(component.close, 'emit');
		spyOn(console, 'error');

		component.onSubmit(shiftModel);

		expect(shiftServiceSpy.addShift).toHaveBeenCalledWith({
			creditTips: 100,
			cashTips: 50,
			tipout: 20,
			date: convertedDate,
			hoursWorked: 8
		} as CreateShiftDto);
		expect(console.error).toHaveBeenCalledWith(error);
		expect(component.close.emit).not.toHaveBeenCalled();
	});
});