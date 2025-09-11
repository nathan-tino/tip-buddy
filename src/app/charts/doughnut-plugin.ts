// Chart plugin registration for displaying centered text in doughnut charts.
// This module guards registration with a global variable so the plugin is only
// registered once, which prevents duplicate registrations during HMR.

import { Chart } from 'chart.js';

declare global {
  interface Window {
    __tipbuddy_doughnut_registered?: boolean;
  }
}

if (!window.__tipbuddy_doughnut_registered) {
  Chart.register({
    id: 'doughnutCenterText',
    afterDraw: function(chart: any) {
      if (chart.config && chart.config.options && chart.config.options.plugins && chart.config.options.plugins.doughnutCenterText?.display) {
        const { ctx, chartArea } = chart;
        const centerConfig = chart.config.options.plugins.doughnutCenterText;
        ctx.save();
        const fontConfig = centerConfig.font ?? { size: 16, weight: 'normal' };
        ctx.font = `${fontConfig.weight} ${fontConfig.size}px sans-serif`;
        ctx.fillStyle = centerConfig.color ?? '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          centerConfig.text ?? '',
          (chartArea.left + chartArea.right) / 2,
          (chartArea.top + chartArea.bottom) / 2
        );
        ctx.restore();
      }
    }
  });

  window.__tipbuddy_doughnut_registered = true;
}
