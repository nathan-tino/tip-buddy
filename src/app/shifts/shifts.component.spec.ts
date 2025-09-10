import { ComponentFixture, TestBed } from '@angular/core/testing';
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
      id: 1,
      date: new Date('2023-01-01T00:00:00Z'),
      hoursWorked: 5,
      cashTips: 50,
      creditTips: 100,
      tipout: 20
    }
  ];

  const localDate = new Date('2023-01-01T00:00:00Z');

  beforeEach(async () => {
    mockShiftService = jasmine.createSpyObj('ShiftService', ['getShiftsSummary', 'deleteShift', 'sortByDateAscending']);
    mockDateService = jasmine.createSpyObj('DateService', ['getFirstAndLastDayOfWeek', 'convertUtcToLocalDate', 'addDaysToDate']);

    mockDateService.getFirstAndLastDayOfWeek.and.returnValue({
      firstDayOfWeek: new Date(2023, 0, 1), // January 1, 2023
      lastDayOfWeek: new Date(2023, 0, 7) // January 7, 2023
    });

    mockDateService.convertUtcToLocalDate.and.returnValue(localDate);
    const mockSummary: any = {
      shifts: mockShifts,
      cashTipsTotal: 50,
      creditTipsTotal: 100,
      cashTipsPercentage: 33.3333,
      creditTipsPercentage: 66.6667,
      totalTips: 150,
      totalShifts: mockShifts.length,
      totalHoursWorked: mockShifts.reduce((s, m) => s + (m.hoursWorked!), 0),
      averageTipsPerShift: 150 / mockShifts.length,
      tipsPerHour: 150 / mockShifts.reduce((s, m) => s + (m.hoursWorked!), 0),
      // keep shifts array
    };
    mockShiftService.getShiftsSummary.and.returnValue(of(mockSummary));
    mockShiftService.sortByDateAscending.and.callFake((a: GetShiftDto, b: GetShiftDto) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Reset spies
    mockShiftService.getShiftsSummary.calls.reset();
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
      @Input() firstDay: any;
      @Input() shifts: any;
      @Output() addShift = new EventEmitter<Date>();
      @Output() editShift = new EventEmitter<any>();
      @Output() deleteShift = new EventEmitter<number>();
    }

    // Explicitly override ShiftsComponent imports to use only the stub
    TestBed.overrideComponent(ShiftsComponent, {
      set: {
        imports: [AddShiftComponent, BaseChartDirective, EditShiftComponent, DatePipe, CurrencyPipe, StubWeekComponent, SummaryComponent]
      }
    });

    await TestBed.configureTestingModule({
      imports: [
        ShiftsComponent,
        AddShiftComponent,
        EditShiftComponent,
        BaseChartDirective,
        StubWeekComponent,
        SummaryComponent
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
    expect(mockShiftService.getShiftsSummary).toHaveBeenCalled();
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
      id: 2,
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
    // After deletion, mock getShiftsSummary to return empty shifts
    mockShiftService.getShiftsSummary.and.returnValue(of({
      shifts: [],
      cashTipsTotal: 0,
      creditTipsTotal: 0,
      cashTipsPercentage: 0,
      creditTipsPercentage: 0,
      totalTips: 0,
      totalShifts: 0,
      totalHoursWorked: 0,
      averageTipsPerShift: 0,
      tipsPerHour: 0
    }));

    component.onDeleteShift(1);
    expect(mockShiftService.deleteShift).toHaveBeenCalledWith(1);
    expect(component.shifts.length).toBe(0);
  });

  it('should handle delete error gracefully', () => {
    spyOn(console, 'error');
    mockShiftService.deleteShift.and.returnValue(throwError(() => new Error('Delete failed')));
    component.onDeleteShift(1);
    expect(console.error).toHaveBeenCalled();
  });

  it('should shift interval forward and reload', () => {
    component.onNextInterval();
    expect(mockShiftService.getShiftsSummary).toHaveBeenCalledTimes(2);
  });

  it('should shift interval backward and reload', () => {
    component.onPreviousInterval();
    expect(mockShiftService.getShiftsSummary).toHaveBeenCalledTimes(2);
  });

  it('should toggle editing state when onEditShift is called', () => {
    component.onEditShift(mockShifts[0]);
    expect(component.activeShift).toEqual(mockShifts[0]);
    expect(component.isEditingShift).toBeTrue();
  });

  function resetShifts() {
    component.shifts = [...mockShifts.map(s => ({ ...s }))];
  }
});
