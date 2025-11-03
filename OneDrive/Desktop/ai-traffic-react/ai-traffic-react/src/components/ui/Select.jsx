/**
 * A reusable Select (dropdown) component.
 */
export default function Select({ options, value, onChange, className = '' }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full rounded-lg border border-primary-light bg-primary-medium p-3
                  text-white placeholder-gray-500 
                  focus:border-accent-violet focus:ring-accent-violet ${className}`}
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="bg-primary-dark"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}