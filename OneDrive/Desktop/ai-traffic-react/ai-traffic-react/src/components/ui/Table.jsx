/**
 * A responsive wrapper for HTML tables.
 * It makes the table horizontally scrollable on small screens.
 */
export default function Table({ columns, data, renderRow, isLoading }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-primary-light">
      <table className="w-full min-w-[800px] text-left text-sm text-gray-300">
        <thead className="bg-primary-light/50 text-xs uppercase text-gray-400">
          <tr>
            {columns.map((col) => (
              <th key={col.header} scope="col" className="p-4">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            // Loading Skeleton
            [...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-primary-light">
                {columns.map((col) => (
                  <td key={col.accessor} className="p-4">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-primary-light"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : (
            // Render actual data
            data.map(renderRow)
          )}
        </tbody>
      </table>
    </div>
  );
}