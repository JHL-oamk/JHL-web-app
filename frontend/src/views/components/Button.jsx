import colors from '../../config/colors';

export const Button = ({ children, variant, size = 'large', className = '', ...props }) => {
  const actualVariant = variant || (size === 'large' ? 'black' : 'red');
  const base = 'font-bold rounded-full flex items-center justify-center transition-all disabled:bg-gray-400 disabled:cursor-not-allowed';

  let customStyle = {};
  let variantClasses = '';
  let sizeClasses = '';

  if (actualVariant === 'black') {
    customStyle = { backgroundColor: colors.black, color: colors.white };
    variantClasses = 'hover:bg-[#333]';
  } else if (actualVariant === 'red') {
    customStyle = { backgroundColor: colors.primary, color: colors.white };
    variantClasses = 'hover:opacity-90';
  } else if (actualVariant === 'white') {
    customStyle = { backgroundColor: colors.white, color: colors.primary };
    variantClasses = 'hover:opacity-90';
  } else if (actualVariant === 'outline') {
    variantClasses = 'bg-transparent border border-black text-black';
  }

  // Sizes: 32, 40, 42
  if (size === 'small') {
    sizeClasses = 'h-[32px] px-6 text-[12px]';
  } else if (size === 'medium') {
    sizeClasses = 'h-[40px] px-6 text-[12px]';
  } else if (size === 'large') {
    sizeClasses = 'h-[42px] px-6 text-[16px] w-full';
  }

  return (
    <button className={`${base} ${variantClasses} ${sizeClasses} ${className}`} style={{ ...customStyle }} {...props}>
      {children}
    </button>
  );
};

export default Button;
