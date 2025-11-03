import { PALETTE } from '../../lib/constants';

/**
 * A single "heat tile" for the Analysis page.
 */
export default function HeatTile({ label, count, maxCount }) {
  // Calculate percentage for the bar width and opacity
  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
  
  // Use percentage for bar width
  const barWidth = `${Math.max(percentage, 5)}%`; // Min 5% width for visibility
  
  // Use percentage to fade from cyan to violet
  // This is a simple linear interpolation
  const opacity = (percentage / 100) * 0.8 + 0.2; // Opacity from 0.2 to 1.0

  return (
    <div className="glass-card !bg-primary-medium/50 p-4 rounded-lg relative overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-300 truncate" title={label}>
          {label}
        </span>
        <span className="font-display font-semibold text-lg text-white">
          {count}
        </span>
      </div>
      <div className="w-full h-2 bg-primary-light/50 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-violet transition-all duration-500"
          style={{ 
            width: barWidth,
            opacity: opacity
          }}
        ></div>
      </div>
    </div>
  );
}