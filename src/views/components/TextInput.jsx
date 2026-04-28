import colors from '../../config/colors';

export const TextInput = ({
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
  autoComplete,
}) => {
  const hasError = touched && error;

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-[12px] font-medium mb-1.5 ml-2" style={{ color: colors.darkGrey }}>
        {required && <span className="mr-1">*</span>}
        {label}
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
        autoComplete={autoComplete}
        className={`w-full px-5 py-3 rounded-full focus:outline-none transition-all placeholder:text-[12px] text-sm ${
          hasError ? 'border-2 border-red-500' : 'border-2 border-transparent'
        }`}
        style={{ 
          backgroundColor: colors.inputBg,
          color: colors.black
        }}
      />
      {hasError && <p className="mt-1.5 ml-2 text-[12px] text-red-500">{error}</p>}
    </div>
  );
};

export default TextInput;
