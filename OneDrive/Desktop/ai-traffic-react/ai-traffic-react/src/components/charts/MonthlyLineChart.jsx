import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { PALETTE } from '../../lib/constants';

// Helper to aggregate data by month
const aggregateByMonth = (violations) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const counts = new Array(12).fill(0);
  
  violations.forEach((v) => {
    const monthIndex = new Date(v.date).getMonth();
    counts[monthIndex] += 1;
  });

  return { labels: months, data: counts };
};

export default function MonthlyLineChart({ violations }) {
  const chartData = useMemo(() => aggregateByMonth(violations), [violations]);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Violations',
        data: chartData.data,
        fill: true,
        borderColor: PALETTE['accent-violet'],
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(167, 139, 250, 0.4)');
          gradient.addColorStop(1, 'rgba(167, 139, 250, 0)');
          return gradient;
        },
        tension: 0.4,
        pointBackgroundColor: PALETTE['accent-violet'],
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: PALETTE['accent-violet'],
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(167, 139, 250, 0.1)',
        },
        ticks: {
          stepSize: 1,
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={data} options={options} />
    </div>
  );
}