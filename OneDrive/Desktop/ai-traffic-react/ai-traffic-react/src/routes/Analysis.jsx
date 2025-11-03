import { useMemo } from 'react';
import { useViolations } from '../context/ViolationsContext';
import ChartCard from '../components/ui/ChartCard';
import AreaBarChart from '../components/charts/AreaBarChart';
import TypeDoughnutChart from '../components/charts/TypeDoughnutChart';
import HeatTile from '../components/ui/HeatTile';

// Helper to aggregate data
const aggregateData = (data, key) => {
  return data.reduce((acc, item) => {
    const group = item[key];
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});
};

export default function Analysis() {
  const { allViolations, loading } = useViolations();

  // Memoize aggregated data to prevent re-computation on every render
  const { areaData, typeData } = useMemo(() => {
    const areaCounts = aggregateData(allViolations, 'area');
    const typeCounts = aggregateData(allViolations, 'type');
    
    const formatForChart = (counts) => ({
      labels: Object.keys(counts),
      data: Object.values(counts),
    });

    return {
      areaData: formatForChart(areaCounts),
      typeData: formatForChart(typeCounts),
    };
  }, [allViolations]);

  const maxAreaCount = useMemo(
    () => Math.max(0, ...areaData.data),
    [areaData]
  );

  return (
    <div className="space-y-6">
      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <ChartCard title="Violations by Area" className="lg:col-span-3">
          <AreaBarChart chartData={areaData} />
        </ChartCard>
        <ChartCard title="Violations by Type" className="lg:col-span-2">
          <TypeDoughnutChart chartData={typeData} />
        </ChartCard>
      </div>

      {/* Heat Tiles Grid */}
      <ChartCard title="Area Hotspots">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading data...</div>
        ) : areaData.labels.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {areaData.labels.map((area, index) => (
              <HeatTile
                key={area}
                label={area}
                count={areaData.data[index]}
                maxCount={maxAreaCount}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">No data to display.</div>
        )}
      </ChartCard>
    </div>
  );
}