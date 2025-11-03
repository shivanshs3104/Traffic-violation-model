import clsx from 'clsx';

/**
 * A glassmorphism card for displaying key statistics.
 */
export default function StatCard({
  title,
  value,
  icon,
  iconColor,
  isLoading,
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          {isLoading ? (
            <div className="mt-2 h-8 w-24 animate-pulse rounded-md bg-primary-light"></div>
          ) : (
            <p className="mt-1 font-display text-3xl font-semibold text-white">
              {value}
            </p>
          )}
        </div>
        <div
          className={clsx(
            'flex h-12 w-12 items-center justify-center rounded-full bg-primary-light',
            iconColor
          )}
        >
          <i className={clsx(icon, 'text-2xl')}></i>
        </div>
      </div>
    </div>
  );
}