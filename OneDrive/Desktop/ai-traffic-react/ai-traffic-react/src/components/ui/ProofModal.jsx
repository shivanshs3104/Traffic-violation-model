import { Fragment } from 'react';
import { PALETTE } from '../../lib/constants';
import Button from './Button';
import clsx from 'clsx';

// Helper to format currency
const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
});

/**
 * Renders a single detail item in the modal.
 */
const DetailItem = ({ label, value, className = '' }) => (
  <div className={`py-3 ${className}`}>
    <dt className="text-sm font-medium text-gray-400">{label}</dt>
    <dd className="mt-1 text-base font-semibold text-white">{value || 'N/A'}</dd>
  </div>
);

export default function ProofModal({ isOpen, onClose, violation, onMarkPaid }) {
  if (!isOpen) return null;

  const handleMarkPaidClick = () => {
    onMarkPaid(violation.id);
  };
  
  const handleImageError = (e) => {
    e.currentTarget.src = 'https://via.placeholder.com/600x400.png?text=Proof+Not+Available';
  };
  
  const handlePlateError = (e) => {
    e.currentTarget.src = 'https://via.placeholder.com/150x100.png?text=N/A';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className="glass-card !bg-primary-medium w-full max-w-4xl max-h-[90vh] 
                   rounded-2xl shadow-glass-hard overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-primary-light/50">
          <h2 className="font-display text-xl font-semibold text-white">
            Violation Details (ID: {violation.id})
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-white"
          >
            <i className="ri-close-line"></i>
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Images */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Violation Proof
              </h3>
              <img
                src={violation.proof.image || 'images/placeholder_proof.jpg'}
                alt="Violation Proof"
                className="w-full rounded-lg object-cover border border-primary-light"
                onError={handleImageError}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                License Plate Crop
              </h3>
              <img
                src={violation.proof.plate_crop || 'images/placeholder_plate.jpg'}
                alt="License Plate"
                className="max-w-[200px] rounded-lg object-cover border border-primary-light"
                onError={handlePlateError}
              />
            </div>
          </div>

          {/* Right: Details */}
          <div className="md:col-span-1">
            <dl className="divide-y divide-primary-light/50">
              <DetailItem
                label="Status"
                value={violation.status}
                className={clsx(
                  violation.status === 'Paid' && '!text-green-400',
                  violation.status === 'Pending' && '!text-yellow-400',
                  violation.status === 'Overdue' && '!text-red-400'
                )}
              />
              <DetailItem label="Violator" value={violation.name} />
              <DetailItem label="Vehicle No." value={violation.vehicle} />
              <DetailItem label="Violation Type" value={violation.type} />
              <DetailItem label="Area" value={violation.area} />
              <DetailItem
                label="Date & Time"
                value={new Date(violation.date).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              />
              <DetailItem
                label="Fine"
                value={currencyFormatter.format(violation.fine)}
              />
              <DetailItem label="Speed Detected" value={violation.speed ? `${violation.speed} km/h` : 'N/A'} />
              <DetailItem label="Camera ID" value={violation.camera} />
            </dl>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-end p-4 border-t border-primary-light/50 space-x-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {violation.status !== 'Paid' && (
            <Button variant="gradient" onClick={handleMarkPaidClick}>
              <i className="ri-check-double-line mr-2"></i>
              Mark as Paid
            </Button>
          )}
        </footer>
      </div>
    </div>
  );
}