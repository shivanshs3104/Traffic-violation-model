import { Doughnut } from 'react-chartjs-2';
import { PALETTE } from '../../lib/constants';

export default function TypeDoughnutChart({ chartData }) {
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Violations',
        data: chartData.data,
        backgroundColor: [
          PALETTE['accent-violet'],
          PALETTE['accent-pink'],
          PALETTE['accent-cyan'],
          '#facc15', // yellow-400
          '#34d399', // emerald-400
        ],
        borderColor: PALETTE['primary-medium'],
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    cutout: '60%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 15,
        },
      },
    },
  };

  return (
    <div style={{ height: '350px' }} className="flex justify-center items-center">
      <Doughnut data={data} options={options} />
    </div>
  );
}