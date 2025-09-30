import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js controllers and elements for tests
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AddShiftComponent } from './add-shift/add-shift.component';
import { EditShiftComponent } from './edit-shift/edit-shift.component';
import { SummaryComponent } from './summary/summary.component';
import { BaseChartDirective } from 'ng2-charts';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { of, throwError } from 'rxjs';
import { ShiftsComponent } from './shifts.component';
import { ShiftService } from '../services/shift.service';
import { DateService } from '../services/date.service';
import { GetShiftDto } from '../dtos/get-shift.dto';

describe('ShiftsComponent', () => {
	let component: ShiftsComponent;
	let fixture: ComponentFixture<ShiftsComponent>;
	let mockShiftService: jasmine.SpyObj<ShiftService>;
	let mockDateService: jasmine.SpyObj<DateService>;

	const mockShifts: GetShiftDto[] = [
		{
			id: '1',
			date: new Date('2023-01-01T00:00:00Z'),
			hoursWorked: 5,
			cashTips: 50,
			creditTips: 100,
			tipout: 20
		}
	];

	const localDate = new Date('2023-01-01T00:00:00Z');

	beforeEach(async () => {
		mockShiftService = jasmine.createSpyObj('ShiftService', ['getShifts', 'deleteShift', 'sortByDateAscending', 'calculateShiftsSummary', 'triggerRefresh'], {
			refreshTrigger$: jasmine.createSpy('refreshTrigger$').and.returnValue(0)
		});
		mockDateService = jasmine.createSpyObj('DateService', ['getFirstAndLastDayOfWeek', 'convertUtcToLocalDate', 'addDaysToDate']);

		mockDateService.getFirstAndLastDayOfWeek.and.returnValue({
			firstDayOfWeek: new Date(2023, 0, 1), // January 1, 2023
			lastDayOfWeek: new Date(2023, 0, 7) // January 7, 2023
		});

		mockDateService.convertUtcToLocalDate.and.returnValue(localDate);

		mockDateService.addDaysToDate.and.callFake((date: Date, days: number) => {
			const result = new Date(date);
			result.setDate(result.getDate() + days);
			return result;
		});

		mockShiftService.getShifts.and.returnValue(of(mockShifts));
		mockShiftService.sortByDateAscending.and.callFake((a: GetShiftDto, b: GetShiftDto) =>
			new Date(a.date).getTime() - new Date(b.date).getTime()
		);

		// Reset spies
		mockShiftService.getShifts.calls.reset();
		mockShiftService.deleteShift.calls.reset();
		mockShiftService.sortByDateAscending.calls.reset();
		mockDateService.getFirstAndLastDayOfWeek.calls.reset();
		mockDateService.convertUtcToLocalDate.calls.reset();
		mockDateService.addDaysToDate.calls.reset();

		// Create a lightweight stub for the child WeekComponent as a standalone component
		@Component({
			selector: 'app-week',
			template: '',
			standalone: true
		})
		class StubWeekComponent {
			@Input() firstDay: unknown;
			@Input() shifts: unknown;
			@Output() addShift = new EventEmitter<Date>();
			@Output() editShift = new EventEmitter<unknown>();
			@Output() deleteShift = new EventEmitter<number>();
		}

		// Explicitly override ShiftsComponent imports to use only the stub
		TestBed.overrideComponent(ShiftsComponent, {
			set: {
				imports: [AddShiftComponent, BaseChartDirective, EditShiftComponent, DatePipe, CurrencyPipe, StubWeekComponent, SummaryComponent, CardModule, ToolbarModule, DividerModule, ButtonModule]
			}
		});

		await TestBed.configureTestingModule({
			imports: [
				ShiftsComponent,
				AddShiftComponent,
				EditShiftComponent,
				BaseChartDirective,
				StubWeekComponent,
				SummaryComponent,
				CardModule,
				ToolbarModule,
				DividerModule,
				ButtonModule
			],
			providers: [
				{ provide: ShiftService, useValue: mockShiftService },
				{ provide: DateService, useValue: mockDateService }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ShiftsComponent);
		component = fixture.componentInstance;
		// Initialize inputs that child components (like WeekComponent) expect
		component.firstDayOfInterval = new Date(2023, 0, 1);
		component.lastDayOfInterval = new Date(2023, 0, 7);
		component.shifts = [...mockShifts.map(s => ({ ...s }))];
		fixture.detectChanges(); // ngOnInit runs, shifts are loaded
	});

	afterEach(() => {
		// Restore console.error if spied on
		if ((console.error as any).and) {
			(console.error as any).and.callThrough();
		}
	});

	it('should create the component', () => {
		expect(component).toBeTruthy();
	});

	it('should load shifts on init', () => {
		expect(mockShiftService.getShifts).toHaveBeenCalled();
		expect(component.shifts.length).toBe(1);
		expect(component.shifts[0].date).toEqual(localDate);
	});

	it('should set isAddingShift and dateToAddShift when onAddShift is called', () => {
		const date = new Date();
		component.onAddShift(date);
		expect(component.isAddingShift).toBeTrue();
		expect(component.dateToAddShift).toBe(date);
	});

	it('should add shift on onFinishAddShift', () => {
		resetShifts();

		const newShift: GetShiftDto = {
			id: '2',
			date: new Date(),
			hoursWorked: 4,
			cashTips: 40,
			creditTips: 80,
			tipout: 10
		};

		component.onFinishAddShift(newShift);
		expect(component.shifts.length).toBe(2);
		expect(component.isAddingShift).toBeFalse();
	});

	it('should update shift on onFinishEditShift', () => {
		resetShifts();

		const updatedShift = { ...mockShifts[0], cashTips: 999 };
		component.onFinishEditShift(updatedShift);

		const updated = component.shifts.find(s => s.id === updatedShift.id);
		expect(updated?.cashTips).toBe(999);
		expect(component.isEditingShift).toBeFalse();
	});

	it('should delete shift on onDeleteShift', () => {
		resetShifts();
		mockShiftService.deleteShift.and.returnValue(of(void 0));

		component.onDeleteShift('1');
		expect(mockShiftService.deleteShift).toHaveBeenCalledWith('1');
		expect(component.shifts.length).toBe(0);
	});

	it('should handle delete error gracefully', () => {
		spyOn(console, 'error');
		mockShiftService.deleteShift.and.returnValue(throwError(() => new Error('Delete failed')));
		component.onDeleteShift('1');
		expect(console.error).toHaveBeenCalled();
	});

	it('should shift interval forward and reload', () => {
		component.firstDayOfInterval = new Date(2023, 0, 1);
		component.lastDayOfInterval = new Date(2023, 0, 7);

		expect(mockShiftService.getShifts).toHaveBeenCalledTimes(1);
		component.onNextInterval();
		expect(mockShiftService.getShifts).toHaveBeenCalledTimes(2);
	});

	it('should shift interval backward and reload', () => {
		expect(mockShiftService.getShifts).toHaveBeenCalledTimes(1);
		component.onPreviousInterval();
		expect(mockShiftService.getShifts).toHaveBeenCalledTimes(2);
	});

	it('should toggle editing state when onEditShift is called', () => {
		component.onEditShift(mockShifts[0]);
		expect(component.activeShift).toEqual(mockShifts[0]);
		expect(component.isEditingShift).toBeTrue();
	});

	it('should return early in loadShifts if interval dates are missing', () => {
		component.firstDayOfInterval = undefined;
		component.lastDayOfInterval = undefined;
		// Spy on getShifts to ensure it is NOT called
		mockShiftService.getShifts.calls.reset();
		component.loadShifts();
		expect(mockShiftService.getShifts).not.toHaveBeenCalled();
	});

	it('should call loadShiftsForDate with correct date on week picker change', () => {
		const loadShiftsForDateSpy = spyOn(component, 'loadShiftsForDate');
		const event = { target: { value: '2023-01-02' } } as unknown as Event;
		component.onWeekPickerChange(event);
		expect(loadShiftsForDateSpy).toHaveBeenCalledWith(new Date('2023-01-02T00:00:00'));
	});

	it('should not call loadShiftsForDate if week picker value is empty', () => {
		const loadShiftsForDateSpy = spyOn(component, 'loadShiftsForDate');
		const event = { target: { value: '' } } as unknown as Event;
		component.onWeekPickerChange(event);
		expect(loadShiftsForDateSpy).not.toHaveBeenCalled();
	});

	describe('loadShiftsForDate', () => {
		// Centralized test constants for this describe block
		const testDate = new Date('2023-03-15T10:30:00');
		const expectedFirstDay = new Date(2023, 2, 12); // March 12, 2023 (Sunday)
		const expectedLastDay = new Date(2023, 2, 18); // March 18, 2023 (Saturday)

		it('should call setIntervalDates with provided date and loadShifts when setIntervalDates returns true', () => {
			const setIntervalDatesSpy = spyOn(component, 'setIntervalDates').and.returnValue(true);
			const loadShiftsSpy = spyOn(component, 'loadShifts');

			component.loadShiftsForDate(testDate);

			expect(setIntervalDatesSpy).toHaveBeenCalledWith(testDate);
			expect(loadShiftsSpy).toHaveBeenCalledTimes(1);
		});

		it('should call setIntervalDates with null when no date is provided and loadShifts when setIntervalDates returns true', () => {
			const setIntervalDatesSpy = spyOn(component, 'setIntervalDates').and.returnValue(true);
			const loadShiftsSpy = spyOn(component, 'loadShifts');

			component.loadShiftsForDate();

			expect(setIntervalDatesSpy).toHaveBeenCalledWith(null);
			expect(loadShiftsSpy).toHaveBeenCalledTimes(1);
		});

		it('should call setIntervalDates with null when explicitly passed null and loadShifts when setIntervalDates returns true', () => {
			const setIntervalDatesSpy = spyOn(component, 'setIntervalDates').and.returnValue(true);
			const loadShiftsSpy = spyOn(component, 'loadShifts');

			component.loadShiftsForDate(null);

			expect(setIntervalDatesSpy).toHaveBeenCalledWith(null);
			expect(loadShiftsSpy).toHaveBeenCalledTimes(1);
		});

		it('should not call loadShifts when setIntervalDates returns false', () => {
			const setIntervalDatesSpy = spyOn(component, 'setIntervalDates').and.returnValue(false);
			const loadShiftsSpy = spyOn(component, 'loadShifts');

			component.loadShiftsForDate(testDate);

			expect(setIntervalDatesSpy).toHaveBeenCalledWith(testDate);
			expect(loadShiftsSpy).not.toHaveBeenCalled();
		});

		it('should integrate properly with the actual setIntervalDates method logic', () => {
			// This test verifies the integration between loadShiftsForDate and setIntervalDates
			// without mocking setIntervalDates, to ensure the real logic works correctly

			mockDateService.getFirstAndLastDayOfWeek.and.returnValue({
				firstDayOfWeek: expectedFirstDay,
				lastDayOfWeek: expectedLastDay
			});

			// Reset the getShifts spy to track this specific call
			mockShiftService.getShifts.calls.reset();
			mockShiftService.getShifts.and.returnValue(of(mockShifts));

			component.loadShiftsForDate(testDate);

			// Verify the component state was updated correctly
			expect(component.firstDayOfInterval).toEqual(expectedFirstDay);
			expect(component.lastDayOfInterval).toEqual(expectedLastDay);
			expect(mockShiftService.getShifts).toHaveBeenCalledWith(expectedFirstDay, expectedLastDay);
		});
	});

	function resetShifts() {
		component.shifts = [...mockShifts.map(s => ({ ...s }))];
	}
});

