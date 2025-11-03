import { useState, useMemo } from 'react';
import { useViolations } from '../context/ViolationsContext';
import Table from '../components/ui/Table';
import ProofModal from '../components/ui/ProofModal';
import Button from '../components/ui/Button';
import SearchBar from '../components/ui/SearchBar';
import Select from '../components/ui/Select';
import ChartCard from '../components/ui/ChartCard';

// Helper to format currency
const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
});

const STATUS_OPTIONS = [
  { value: 'All', label: 'All Statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Overdue', label: 'Overdue' },
];

export default function Violations() {
  const { allViolations, loading, markAsPaid, activeTypeFilter } =
    useViolations();

  // Local filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState(null);

  // Filter logic
  const filteredData = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();

    return allViolations.filter((v) => {
      // 1. Filter by Status
      if (statusFilter !== 'All' && v.status !== statusFilter) {
        return false;
      }
      // 2. Filter by Type (from global context/sidebar)
      if (activeTypeFilter && v.type !== activeTypeFilter) {
        return false;
      }
      // 3. Filter by Search Term
      if (searchTerm) {
        return (
          v.name.toLowerCase().includes(lowerSearch) ||
          v.vehicle.toLowerCase().includes(lowerSearch) ||
          v.area.toLowerCase().includes(lowerSearch) ||
          v.type.toLowerCase().includes(lowerSearch)
        );
      }
      return true;
    });
  }, [allViolations, searchTerm, statusFilter, activeTypeFilter]);

  // Modal handlers
  const openModal = (violation) => {
    setSelectedViolation(violation);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedViolation(null);
  };

  const handleMarkPaid = (id) => {
    markAsPaid(id);
    if (selectedViolation && selectedViolation.id === id) {
      setSelectedViolation({ ...selectedViolation, status: 'Paid' });
    }
  };

  return (
    <div className="space-y-6">
      <ChartCard title="Manage All Violations">
        {/* Filters Bar */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <SearchBar
              placeholder="Search by name, vehicle, area, type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Select
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Violations Table */}
        <Table
          columns={[
            { header: 'Violator', accessor: 'name' },
            { header: 'Vehicle', accessor: 'vehicle' },
            { header: 'Type', accessor: 'type' },
            { header: 'Area', accessor: 'area' },
            { header: 'Date', accessor: 'date' },
            { header: 'Fine', accessor: 'fine' },
            { header: 'Status', accessor: 'status' },
            { header: 'Actions', accessor: 'actions' },
          ]}
          data={filteredData}
          isLoading={loading}
          renderRow={(violation) => (
            <tr
              key={violation.id}
              className="border-b border-primary-light hover:bg-primary-light/50"
            >
              <td className="p-4 whitespace-nowrap">
                <div className="flex items-center">
                  {/* Placeholder for thumbnail */}
                  <img
                    src={violation.proof.plate_crop || '/images/placeholder_plate.jpg'}
                    alt="Plate"
                    className="h-8 w-12 rounded object-cover mr-3 border border-primary-light"
                    onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/48x32.png?text=N/A'}
                  />
                  <div>
                    <div className="font-medium">{violation.name}</div>
                    <div className="text-sm text-gray-400">
                      {violation.vehicle}
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-4 whitespace-nowrap font-mono">{violation.vehicle}</td>
              <td className="p-4 whitespace-nowrap">{violation.type}</td>
              <td className="p-4 whitespace-nowrap">{violation.area}</td>
              <td className="p-4 whitespace-nowrap">
                {new Date(violation.date).toLocaleString('en-IN', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </td>
              <td className="p-4 whitespace-nowrap">
                {currencyFormatter.format(violation.fine)}
              </td>
              <td className="p-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    violation.status === 'Paid'
                      ? 'bg-green-500/20 text-green-300'
                      : violation.status === 'Pending'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  {violation.status}
                </span>
              </td>
              <td className="p-4 whitespace-nowrap space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openModal(violation)}
                  title="View Proof"
                >
                  <i className="ri-eye-line"></i>
                </Button>
                {violation.status !== 'Paid' && (
                  <Button
                    size="sm"
                    variant="gradient"
                    onClick={() => handleMarkPaid(violation.id)}
                    title="Mark as Paid"
                  >
                    <i className="ri-check-line"></i>
                  </Button>
                )}
              </td>
            </tr>
          )}
        />
        {!loading && filteredData.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No violations found matching your criteria.
          </div>
        )}
      </ChartCard>

      {/* Proof Modal */}
      {selectedViolation && (
        <ProofModal
          isOpen={modalOpen}
          onClose={closeModal}
          violation={selectedViolation}
          onMarkPaid={handleMarkPaid}
        />
      )}
    </div>
  );
}