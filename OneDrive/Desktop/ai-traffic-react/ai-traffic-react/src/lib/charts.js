import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

/**
 * Registers all necessary Chart.js components.
 * This file should be imported ONCE in main.jsx or App.jsx.
 */
try {
  Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler // For filled line charts
  );

  // Set global defaults for all charts
  Chart.defaults.maintainAspectRatio = false;
  Chart.defaults.responsive = true;

  Chart.defaults.color = '#cbd5e1'; // slate-300
  Chart.defaults.borderColor = 'rgba(167, 139, 250, 0.2)'; // accent-violet alpha

  Chart.defaults.plugins.legend.position = 'top';
  Chart.defaults.plugins.legend.labels.color = '#cbd5e1';
  Chart.defaults.plugins.legend.labels.font = {
    family: "'Inter', sans-serif",
  };

  Chart.defaults.plugins.tooltip.enabled = true;
  Chart.defaults.plugins.tooltip.mode = 'index';
  Chart.defaults.plugins.tooltip.intersect = false;
  Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(20, 18, 43, 0.9)'; // primary-medium
  Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
  Chart.defaults.plugins.tooltip.bodyColor = '#e2e8f0'; // slate-200
  Chart.defaults.plugins.tooltip.borderColor = 'rgba(167, 139, 250, 0.5)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.caretPadding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.titleFont = {
    family: "'Poppins', sans-serif",
    weight: '600',
  };
  Chart.defaults.plugins.tooltip.bodyFont = {
    family: "'Inter', sans-serif",
  };
} catch (error) {
  console.error('Failed to register Chart.js components:', error);
  // This helps fulfill the "graceful fallback" requirement.
  // Components using <Line>, <Bar> etc. will now check if Chart.registry.controllers.has('line')
}