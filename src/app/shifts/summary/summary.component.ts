import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

import { ShiftsSummaryDto } from '../../dtos/shifts-summary.dto';
import { GetShiftDto } from '../../dtos/get-shift.dto';
import { ShiftService } from '../../services/shift.service';
import { ChartTypeRegistry, TooltipItem } from 'chart.js';

// NOTE: The doughnut center-text plugin is registered in
// `src/app/charts/doughnut-plugin.ts` and imported for its side-effect from
// `src/app/app.config.ts`. That keeps plugin registration centralized and
// prevents duplicate registrations during hot module reloads (HMR) or
// repeated imports.

// Extend Chart.js types to include custom doughnutCenterText plugin
declare module 'chart.js' {
	interface PluginOptionsByType<TType extends keyof ChartTypeRegistry> {
		doughnutCenterText?: {
			display: boolean;
			text: string;
			color: string;
			font: { size: number; weight: string };
		};
	}
}

@Component({
	selector: 'app-summary',
	standalone: true,
	imports: [BaseChartDirective, CurrencyPipe],
	templateUrl: './summary.component.html',
	styleUrl: './summary.component.css'
})
export class SummaryComponent implements OnChanges {
	@Input() shifts: GetShiftDto[] = [];
	summaryData: Omit<ShiftsSummaryDto, 'shifts'> | null = null;
	private readonly CASH_TIPS_LABEL = 'Cash Tips';
	private readonly CREDIT_TIPS_LABEL = 'Credit Tips';

	constructor(private shiftService: ShiftService) { }

	doughnutChartData = {
		labels: [this.CASH_TIPS_LABEL, this.CREDIT_TIPS_LABEL],
		datasets: [
			{ data: [0, 0], backgroundColor: ['#4caf50', '#2196f3'] }
		]
	};

	doughnutChartOptions = {
		responsive: false,
		plugins: {
			legend: {
				position: 'bottom' as  'bottom'
			},
			title: {
				display: true,
				text: 'Tips Breakdown'
			},
			tooltip: {
				callbacks: {
					label: (context: TooltipItem<'doughnut'>) => {
						const label = context.label || '';
						const value = context.parsed;
						return `${label}: $${value.toLocaleString()}`;
					}
				}
			},
			// Custom plugin for center text
			doughnutCenterText: {
				display: true,
				text: '$0',
				color: '#222',
				font: { size: 22, weight: 'bold' }
			}
		}
	};

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['shifts']) {
			const summary = this.shiftService.calculateShiftsSummary(this.shifts);
			this.summaryData = summary;
			this.updateChart(this.summaryData);
		}
	}

	private updateChart(summary: Omit<ShiftsSummaryDto, 'shifts'> | null) {
		if (!summary) {
			this.doughnutChartData = {
				labels: [this.CASH_TIPS_LABEL, this.CREDIT_TIPS_LABEL],
				datasets: [{ data: [0, 0], backgroundColor: ['#4caf50', '#2196f3'] }]
			};
			this.doughnutChartOptions.plugins.doughnutCenterText.text = '$0';
			return;
		}

		this.doughnutChartData = {
			labels: [
				`${this.CASH_TIPS_LABEL} (${summary.cashTipsPercentage.toFixed(1)}%)`,
				`${this.CREDIT_TIPS_LABEL} (${summary.creditTipsPercentage.toFixed(1)}%)`
			],
			datasets: [
				{
					data: [summary.cashTipsTotal, summary.creditTipsTotal],
					backgroundColor: ['#4caf50', '#2196f3']
				}
			]
		};

		let totalTipsText = `$${summary.totalTips.toLocaleString()}`;
		this.doughnutChartOptions.plugins.doughnutCenterText.text = totalTipsText;
	}
}
