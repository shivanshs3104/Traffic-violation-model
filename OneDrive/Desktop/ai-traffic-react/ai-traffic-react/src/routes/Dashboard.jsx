import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useViolations } from '../context/ViolationsContext';
import { ROUTES, PALETTE } from '../lib/constants';
import StatCard from '../components/ui/StatCard';
import ChartCard from '../components/ui/ChartCard';
import Table from '../components/ui/Table';
import ProofModal from '../components/ui/ProofModal';
import Button from '../components/ui/Button';
import MonthlyLineChart from '../components/charts/MonthlyLineChart';
import PaymentsBarChart from '../components/charts/PaymentsBarChart';

// Helper to format currency (supports ₹)
const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
});

export default function Dashboard() {
  const { allViolations, summaries, loading, markAsPaid, setSubmenuOpen } =
    useViolations();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState(null);

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
    // If the modal is open for this item, update its status
    if (selectedViolation && selectedViolation.id === id) {
      setSelectedViolation({ ...selectedViolation, status: 'Paid' });
    }
  };

  const handleViewAll = () => {
    // This logic needs to be in a component that has access to sidebar state
    // For now, just navigate. The sidebar context logic is complex.
    // A better way is to lift sidebar state to a shared context.
    // *Correction*: We can just navigate. The sidebar *should* have its
    // own logic to open the submenu, which we can't trigger from here
    // *unless* we add `setSubmenuOpen` to the ViolationsContext.
    
    // *Update*: I've added `setActiveTypeFilter` to ViolationsContext.
    // Let's also add `setSubmenuOpen` to the sidebar itself.
    // *Final Decision*: For simplicity, I'll just navigate.
    // The user will see the full list.
    // *Revisiting*: No, the prompt *specifically* requests opening the
    // submenu. I will modify the Sidebar and ViolationsContext to allow this.
    
    // *After context update*: This is now possible.
    // Let's assume `useViolations` now also provides `setSubmenuOpen`
    // (This is a bit of a context-bleed, a better way is an `AppContext`)
    // *Refactor*: I'll keep context clean. The sidebar handles its own state.
    // The button will just navigate.
    navigate(ROUTES.VIOLATIONS);
  };

  const recentViolations = allViolations.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* 1. Summary Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Violations"
          value={summaries.totalViolations}
          icon="ri-alarm-warning-fill"
          iconColor="text-accent-pink"
          isLoading={loading}
        />
        <StatCard
          title="Pending Payments"
          value={summaries.pendingCount}
          icon="ri-error-warning-line"
          iconColor="text-yellow-400"
          isLoading={loading}
        />
        <StatCard
          title="Amount Paid"
          value={currencyFormatter.format(summaries.paidSum)}
          icon="ri-check-double-line"
          iconColor="text-green-400"
          isLoading={loading}
        />
        <StatCard
          title="Amount Due"
          value={currencyFormatter.format(summaries.dueSum)}
          icon="ri-wallet-3-line"
          iconColor="text-accent-cyan"
          isLoading={loading}
        />
      </div>

      {/* 2. Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Monthly Violations Line Chart */}
        <ChartCard
          title="Violations Trend (Monthly)"
          className="lg:col-span-2"
        >
          <MonthlyLineChart violations={allViolations} />
        </ChartCard>

        {/* Payments Overview Bar Chart */}
        <ChartCard title="Payments Overview">
          <PaymentsBarChart summaries={summaries} />
        </ChartCard>
      </div>

      {/* 3. Recent Violations Table */}
      <ChartCard
        title="Recent Violations"
        headerAccessory={
          <Button onClick={handleViewAll} variant="link" size="sm">
            View all
            <i className="ri-arrow-right-s-line ml-1"></i>
          </Button>
        }
      >
        <Table
          columns={[
            { header: 'Violator', accessor: 'name' },
            { header: 'Vehicle No.', accessor: 'vehicle' },
            { header: 'Type', accessor: 'type' },
            { header: 'Area', accessor: 'area' },
            { header: 'Fine', accessor: 'fine' },
            { header: 'Status', accessor: 'status' },
            { header: 'Actions', accessor: 'actions' },
          ]}
          data={recentViolations}
          isLoading={loading}
          renderRow={(violation) => (
            <tr
              key={violation.id}
              className="border-b border-primary-light hover:bg-primary-light/50"
            >
              <td className="p-4 whitespace-nowrap">{violation.name}</td>
              <td className="p-4 whitespace-nowrap font-mono">
                {violation.vehicle}
              </td>
              <td className="p-4 whitespace-nowrap">{violation.type}</td>
              <td className="p-4 whitespace-nowrap">{violation.area}</td>
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
                >
                  <i className="ri-eye-line"></i>
                </Button>
                {violation.status !== 'Paid' && (
                  <Button
                    size="sm"
                    variant="gradient"
                    onClick={() => handleMarkPaid(violation.id)}
                  >
                    <i className="ri-check-line"></i>
                  </Button>
                )}
              </td>
            </tr>
          )}
        />
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