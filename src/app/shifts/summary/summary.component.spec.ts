import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChanges } from '@angular/core';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend, TooltipItem } from 'chart.js';

import { SummaryComponent } from './summary.component';
import { ShiftService } from '../../services/shift.service';

// Register Chart.js controllers and elements for tests
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let mockShiftService: jasmine.SpyObj<ShiftService>;

  beforeEach(async () => {
    mockShiftService = jasmine.createSpyObj('ShiftService', ['calculateShiftsSummary']);

    await TestBed.configureTestingModule({
      imports: [SummaryComponent],
      providers: [
        { provide: ShiftService, useValue: mockShiftService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    // Test initial center text when summaryData is null
    expect(component.doughnutChartOptions.plugins.doughnutCenterText.text).toBe('$0');
  });

  it('updateChart updates doughnut data and center text', () => {
    const mockShifts = [{
      id: 1,
      date: new Date(),
      cashTips: 200,
      creditTips: 100,
      tipout: 0,
      hoursWorked: 5
    }];

    mockShiftService.calculateShiftsSummary.and.returnValue({
      cashTipsTotal: 200,
      creditTipsTotal: 100,
      totalTipout: 0,
      cashTipsPercentage: 66.6667,
      creditTipsPercentage: 33.3333,
      totalTips: 300,
      totalShifts: 1,
      totalHoursWorked: 5,
      averageTipsPerShift: 300,
      tipsPerHour: 60,
      shifts: mockShifts
    });

    // Set the input and trigger ngOnChanges
    component.shifts = mockShifts;
    const changes: SimpleChanges = {
      shifts: {
        currentValue: mockShifts,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    };
    component.ngOnChanges(changes);

    // Verify chart data updates
    expect(component.doughnutChartData.datasets[0].data[0]).toBe(200);
    expect(component.doughnutChartData.datasets[0].data[1]).toBe(100);
    expect(component.doughnutChartOptions.plugins.doughnutCenterText.text).toContain('300');

    // Test tooltip callback
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx!, { type: 'doughnut', data: { datasets: [] } });
  const mockElement = {} as import('chart.js').Element<any, any>;
    const mockContext: TooltipItem<'doughnut'> = {
      chart,
      label: 'Cash Tips',
      parsed: 200,
      raw: 200,
      formattedValue: '200',
      dataset: { data: [] },
      dataIndex: 0,
      datasetIndex: 0,
      element: mockElement
    };
    const tooltipLabel = component.doughnutChartOptions.plugins.tooltip.callbacks.label(mockContext);
    expect(tooltipLabel).toBe('Cash Tips: $200');

    // Test tooltip callback with empty label
    const mockContextEmpty: TooltipItem<'doughnut'> = {
      chart,
      label: '',
      parsed: 100,
      raw: 100,
      formattedValue: '100',
      dataset: { data: [] },
      dataIndex: 0,
      datasetIndex: 0,
      element: mockElement
    };
    const tooltipLabelEmpty = component.doughnutChartOptions.plugins.tooltip.callbacks.label(mockContextEmpty);
    expect(tooltipLabelEmpty).toBe(': $100');
  });
});
