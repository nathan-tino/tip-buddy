import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
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
	const dateServiceMock = jasmine.createSpyObj('DateService', ['convertStringToUtcDate', 'convertDateObjectsToUtcDate', 'splitLocalDateTimeIntoComponents']);

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

	it('should emit undefined on cancel', () => {
		spyOn(component.close, 'emit');
		component.onCancel();
		expect(component.close.emit).toHaveBeenCalledWith(undefined);
	});

	it('should call editShift and emit updated shift on submit', () => {
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

		dateServiceSpy.convertDateObjectsToUtcDate.and.returnValue(convertedDate);
		shiftServiceSpy.editShift.and.returnValue(of(updatedShift));
		spyOn(component.close, 'emit');

		component.onSubmit(shiftModel);

		expect(dateServiceSpy.convertDateObjectsToUtcDate).toHaveBeenCalledWith(shiftModel.date, shiftModel.time);
		expect(shiftServiceSpy.editShift).toHaveBeenCalledWith('1', updatedShift);
		expect(component.close.emit).toHaveBeenCalledWith(updatedShift);
	});
});