import { Bar } from 'react-chartjs-2';
import { PALETTE } from '../../lib/constants';
import ProgressBar from '../ui/ProgressBar';

// Helper to format currency
const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
});

export default function PaymentsBarChart({ summaries }) {
  const { paidSum, dueSum } = summaries;
  const total = paidSum + dueSum;
  const paidPercent = total > 0 ? (paidSum / total) * 100 : 0;
  const duePercent = total > 0 ? (dueSum / total) * 100 : 0;

  const data = {
    labels: ['Payments'],
    datasets: [
      {
        label: 'Paid',
        data: [paidSum],
        backgroundColor: '#22c55e', // green-500
        borderColor: '#16a34a',
        borderWidth: 1,
      },
      {
        label: 'Due',
        data: [dueSum],
        backgroundColor: '#facc15', // yellow-400
        borderColor: '#eab308',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y', // Horizontal bar chart
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          callback: (value) => `₹${value / 1000}k`,
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${currencyFormatter.format(context.raw)}`;
          },
        },
      },
    },
  };

  return (
    <div className="space-y-4" style={{ height: '300px' }}>
      <div className="h-1/2">
        <Bar data={data} options={options} />
      </div>
      <div className="space-y-3 pt-4">
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span className="font-medium text-green-300">Paid</span>
            <span className="text-gray-300">
              {currencyFormatter.format(paidSum)} ({paidPercent.toFixed(0)}%)
            </span>
          </div>
          <ProgressBar value={paidPercent} colorClass="bg-green-500" />
        </div>
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span className="font-medium text-yellow-300">Due</span>
            <span className="text-gray-300">
              {currencyFormatter.format(dueSum)} ({duePercent.toFixed(0)}%)
            </span>
          </div>
          <ProgressBar value={duePercent} colorClass="bg-yellow-400" />
        </div>
      </div>
    </div>
  );
}