import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeekComponent } from './week.component';
import { DateService } from '../../services/date.service';
import { GetShiftDto } from '../../dtos/get-shift.dto';

describe('WeekComponent', () => {
	let component: WeekComponent;
	let fixture: ComponentFixture<WeekComponent>;
	let mockDateService: jasmine.SpyObj<DateService>;

	const baseDate = new Date(2024, 6, 21); // SUNDAY Note: month is zero-based, so 6 = July

	const mockShifts: GetShiftDto[] = [
		{
			id: '1',
			date: new Date(2024, 6, 21),
			cashTips: 50,
			creditTips: 100,
			tipout: 10,
			hoursWorked: 5
		},
		{
			id: '2',
			date: new Date(2024, 6, 23),
			cashTips: 40,
			creditTips: 80,
			tipout: 8,
			hoursWorked: 4
		}
	];

	beforeEach(async () => {
		mockDateService = jasmine.createSpyObj('DateService', ['addDaysToDate']);

		mockDateService.addDaysToDate.and.callFake((start: Date, days: number) => {
			const result = new Date(start);
			result.setDate(result.getDate() + days);
			return result;
		});

		await TestBed.configureTestingModule({
			imports: [WeekComponent],
			providers: [{ provide: DateService, useValue: mockDateService }]
		}).compileComponents();

		fixture = TestBed.createComponent(WeekComponent);
		component = fixture.componentInstance;

		// Set up inputs
		fixture.componentRef.setInput('firstDay', baseDate);
		fixture.componentRef.setInput('shifts', mockShifts);

		fixture.detectChanges(); // Triggers ngOnChanges via signal input binding
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should populate daysAndShifts with correct dates and grouped shifts', () => {
		expect(component.daysAndShifts.length).toBe(7); // one for each day of the week

		const sunday = component.daysAndShifts[0];
		expect(sunday.date.getDay()).toBe(0); // Sunday
		expect(sunday.shifts.length).toBe(1);
		expect(sunday.shifts[0].id).toBe('1');

		const tuesday = component.daysAndShifts[2];
		expect(tuesday.date.getDay()).toBe(2); // Tuesday
		expect(tuesday.shifts.length).toBe(1);
		expect(tuesday.shifts[0].id).toBe('2');
	});

	it('should emit addShift event', () => {
		spyOn(component.addShift, 'emit');
		const date = new Date('2024-07-22');
		component.onAddShift(date);
		expect(component.addShift.emit).toHaveBeenCalledWith(date);
	});

	it('should emit editShift event', () => {
		spyOn(component.editShift, 'emit');
		component.onEditShift(mockShifts[0]);
		expect(component.editShift.emit).toHaveBeenCalledWith(mockShifts[0]);
	});

	it('should emit deleteShift event', () => {
		spyOn(component.deleteShift, 'emit');
		component.onDeleteShift('1');
		expect(component.deleteShift.emit).toHaveBeenCalledWith('1');
	});
});
