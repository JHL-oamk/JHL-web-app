/**
 * Reusable Form Input Component
 */

export const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  required = false,
  disabled = false,
}) => {
  const hasError = touched && error;

  return (
    <div className="mb-5">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-black mb-2"
      >
        {label}
        {required && <span className="text-black ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2 border-2 rounded-none focus:outline-none focus:ring-2 focus:ring-black transition-all ${
          hasError
            ? 'border-black bg-white'
            : 'border-black bg-white'
        } ${disabled ? 'bg-gray-200 cursor-not-allowed' : ''}`}
      />
      {hasError && (
        <p className="mt-2 text-sm text-black">{error}</p>
      )}
    </div>
  );
};
