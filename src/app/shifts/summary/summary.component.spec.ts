import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChanges } from '@angular/core';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js controllers and elements for tests
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

import { SummaryComponent } from './summary.component';
import { ShiftsSummaryDto } from '../../dtos/shifts-summary.dto';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryComponent]
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
    const summary: Omit<ShiftsSummaryDto, 'shifts'> = {
      cashTipsTotal: 200,
      creditTipsTotal: 100,
      cashTipsPercentage: 66.6667,
      creditTipsPercentage: 33.3333,
      totalTips: 300,
      totalShifts: 1,
      totalHoursWorked: 5,
      averageTipsPerShift: 300,
      tipsPerHour: 60
    };

    // Set the input and trigger ngOnChanges
    component.summaryData = summary;
    const changes: SimpleChanges = {
      summaryData: {
        currentValue: summary,
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
    const mockContext = { label: 'Cash Tips', parsed: 200 };
    const tooltipLabel = component.doughnutChartOptions.plugins.tooltip.callbacks.label(mockContext);
    expect(tooltipLabel).toBe('Cash Tips: $200');

    // Test tooltip callback with empty label
    const mockContextEmpty = { label: '', parsed: 100 };
    const tooltipLabelEmpty = component.doughnutChartOptions.plugins.tooltip.callbacks.label(mockContextEmpty);
    expect(tooltipLabelEmpty).toBe(': $100');
  });
});
