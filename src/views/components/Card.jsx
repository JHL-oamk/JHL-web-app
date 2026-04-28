import colors from '../../config/colors';

export const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`mx-auto w-full max-w-[400px] rounded-3xl p-8 md:p-10 ${className}`}
      style={{ backgroundColor: colors.lightGrey }}
    >
      {children}
    </div>
  );
};

export default Card;
