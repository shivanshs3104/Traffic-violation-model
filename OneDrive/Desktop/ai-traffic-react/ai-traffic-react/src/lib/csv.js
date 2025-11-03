/**
 * Converts an array of objects into a CSV string.
 * @param {Array<Object>} data The array of data.
 * @param {Array<string>} columns The specific columns to include.
 * @param {Object} headers A mapping of column keys to display headers.
 * @returns {string} The CSV formatted string.
 */
function convertToCSV(data, columns, headers) {
  if (!data || data.length === 0) {
    return '';
  }

  // Use provided headers or generate from columns
  const csvHeaders = columns.map((col) => headers[col] || col);
  const headerRow = csvHeaders.map((h) => `"${h.replace(/"/g, '""')}"`).join(',');

  const rows = data.map((row) => {
    return columns
      .map((col) => {
        let value = row[col];
        if (value === null || value === undefined) {
          value = '';
        }
        // Handle values that might contain commas or quotes
        const stringValue = String(value);
        return `"${stringValue.replace(/"/g, '""')}"`;
      })
      .join(',');
  });

  return [headerRow, ...rows].join('\r\n');
}

/**
 * Triggers a browser download for the given text content.
 * @param {string} content The content to download.
 * @param {string} fileName The desired file name (e.g., "report.csv").
 * @param {string} mimeType The MIME type (e.g., "text/csv;charset=utf-8;").
 */
export function downloadCSV(content, fileName, mimeType = 'text/csv;charset=utf-8;') {
  // Add BOM for UTF-8 Excel compatibility (especially for currency symbols like ₹)
  const bom = '\uFEFF';
  const blob = new Blob([bom + content], { type: mimeType });

  const link = document.createElement('a');
  if (link.download !== undefined) {
    // Browsers that support HTML5 download attribute
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Main export helper.
 * @param {Array<Object>} data - Array of data objects.
 * @param {Object} mapping - { columns: ['key1', 'key2'], headers: { key1: 'Header 1' } }
 * @param {string} filename - The name of the file to download.
 */
export function exportToCSV(data, mapping, filename) {
  try {
    const csvString = convertToCSV(data, mapping.columns, mapping.headers);
    downloadCSV(csvString, filename);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    alert('An error occurred while exporting the data.');
  }
}