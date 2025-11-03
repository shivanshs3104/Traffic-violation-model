/**
 * A simple progress bar component.
 */
export default function ProgressBar({
  value,
  max = 100,
  colorClass = 'bg-accent-violet',
}) {
  const percentage = (value / max) * 100;

  return (
    <div className="w-full h-2.5 bg-primary-light/50 rounded-full overflow-hidden">
      <div
        className={`h-2.5 rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}