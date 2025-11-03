import { Bar } from 'react-chartjs-2';
import { PALETTE } from '../../lib/constants';

export default function AreaBarChart({ chartData }) {
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Violations',
        data: chartData.data,
        backgroundColor: PALETTE['accent-cyan'],
        borderColor: PALETTE['accent-cyan'],
        borderWidth: 1,
        borderRadius: 4,
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
    <div style={{ height: '350px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}