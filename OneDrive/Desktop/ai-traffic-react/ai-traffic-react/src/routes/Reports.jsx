import { useMemo } from 'react';
import { useViolations } from '../context/ViolationsContext';
import { exportToCSV } from '../lib/csv';
import Button from '../components/ui/Button';
import ChartCard from '../components/ui/ChartCard';

// Helper to format currency
const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
});

// Helper to aggregate data
const aggregateData = (data, key) => {
  const counts = data.reduce((acc, item) => {
    const group = item[key];
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
};

export default function Reports() {
  const { allViolations, summaries } = useViolations();

  // Memoize aggregated data for exports
  const { areaSummary, typeSummary, monthlyData } = useMemo(() => {
    const area = aggregateData(allViolations, 'area').sort(
      (a, b) => b.count - a.count
    );
    const type = aggregateData(allViolations, 'type').sort(
      (a, b) => b.count - a.count
    );

    // Simple monthly aggregation (can be more complex)
    const months = allViolations.reduce((acc, v) => {
      const month = new Date(v.date).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    const monthly = Object.entries(months).map(([month, violations]) => ({
      month,
      violations,
    }));

    return { areaSummary: area, typeSummary: type, monthlyData: monthly };
  }, [allViolations]);

  // --- Export Handlers ---

  const handleExportViolations = () => {
    exportToCSV(
      allViolations,
      {
        columns: [
          'id',
          'name',
          'vehicle',
          'type',
          'area',
          'date',
          'fine',
          'status',
          'speed',
          'camera',
        ],
        headers: {
          id: 'ID',
          name: 'Violator Name',
          vehicle: 'Vehicle No.',
          type: 'Violation Type',
          area: 'Area',
          date: 'Timestamp',
          fine: 'Fine (INR)',
          status: 'Status',
          speed: 'Speed (km/h)',
          camera: 'Camera ID',
        },
      },
      'all_violations_report.csv'
    );
  };

  const handleExportAreaSummary = () => {
    exportToCSV(
      areaSummary,
      {
        columns: ['name', 'count'],
        headers: { name: 'Area', count: 'Total Violations' },
      },
      'area_summary_report.csv'
    );
  };

  const handleExportTypeSummary = () => {
    exportToCSV(
      typeSummary,
      {
        columns: ['name', 'count'],
        headers: { name: 'Violation Type', count: 'Total Violations' },
      },
      'type_summary_report.csv'
    );
  };

  // --- Print Handler ---
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. Export Actions */}
      <ChartCard title="Generate Reports">
        <div
          id="report-actions"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Button
            variant="gradient"
            onClick={handleExportViolations}
            className="justify-center"
          >
            <i className="ri-file-download-line mr-2"></i>
            Export All Violations
          </Button>
          <Button
            variant="outline"
            onClick={handleExportAreaSummary}
            className="justify-center"
          >
            <i className="ri-map-pin-line mr-2"></i>
            Export Area Summary
          </Button>
          <Button
            variant="outline"
            onClick={handleExportTypeSummary}
            className="justify-center"
 C         >
            <i className="ri-alarm-warning-line mr-2"></i>
            Export Type Summary
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
            className="justify-center !border-accent-pink/50 !text-accent-pink hover:!bg-accent-pink/10"
          >
            <i className="ri-printer-line mr-2"></i>
            Print Snapshot
          </Button>
        </div>
      </ChartCard>

      {/* 2. Printable Snapshot */}
      <ChartCard title="Monthly Snapshot" id="printable-snapshot">
        <h2 className="mb-4 font-display text-2xl font-semibold text-white">
          Report Summary
        </h2>
        <p className="mb-6 text-gray-400">
          Snapshot generated on:{' '}
          {new Date().toLocaleString('en-IN', {
            dateStyle: 'full',
            timeStyle: 'long',
          })}
        </p>

        {/* Key Metrics */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-primary-light p-4">
            <div className="text-sm font-medium text-gray-400">
              Total Violations
            </div>
            <div className="mt-1 font-display text-3xl font-semibold text-white">
              {summaries.totalViolations}
            </div>
          </div>
          <div className="rounded-lg border border-primary-light p-4">
            <div className="text-sm font-medium text-gray-400">
              Total Amount Paid
            </div>
            <div className="mt-1 font-display text-3xl font-semibold text-green-400">
              {currencyFormatter.format(summaries.paidSum)}
            </div>
          </div>
          <div className="rounded-lg border border-primary-light p-4">
            <div className="text-sm font-medium text-gray-400">
              Total Amount Due
            </div>
            <div className="mt-1 font-display text-3xl font-semibold text-yellow-400">
              {currencyFormatter.format(summaries.dueSum)}
            </div>
          </div>
        </div>

        {/* Data Tables for Print */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-3 font-display text-xl font-semibold text-white">
              Summary by Type
            </h3>
            <table className="w-full text-left">
              <thead className="border-b border-primary-light text-sm text-gray-400">
                <tr>
                  <th className="p-2">Type</th>
                  <th className="p-2 text-right">Count</th>
                </tr>
              </thead>
              <tbody>
                {typeSummary.map((item) => (
                  <tr key={item.name} className="border-b border-primary-light/50">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2 text-right font-medium">
                      {item.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="mb-3 font-display text-xl font-semibold text-white">
              Summary by Area
            </h3>
            <table className="w-full text-left">
              <thead className="border-b border-primary-light text-sm text-gray-400">
                <tr>
                  <th className="p-2">Area</th>
                  <th className="p-2 text-right">Count</th>
                </tr>
              </thead>
              <tbody>
                {areaSummary.map((item) => (
                  <tr key={item.name} className="border-b border-primary-light/50">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2 text-right font-medium">
                      {item.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}