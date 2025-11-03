/**
 * A glassmorphism wrapper card for charts and tables.
 */
export default function ChartCard({
  title,
  children,
  className = '',
  headerAccessory,
}) {
  return (
    <section
      className={`glass-card overflow-hidden shadow-glass ${className}`}
    >
      {/* Card Header */}
      {title && (
        <header className="flex items-center justify-between p-4 md:p-6 border-b border-primary-light/50">
          <h2 className="font-display text-lg font-semibold text-white">
            {title}
          </h2>
          {headerAccessory && <div>{headerAccessory}</div>}
        </header>
      )}
      
      {/* Card Body */}
      <div className="p-4 md:p-6">
        {children}
      </div>
    </section>
  );
}