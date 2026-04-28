import colors from '../../config/colors';

export const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`mx-auto w-full max-w-[480px] rounded-3xl px-8 md:px-12 py-8 md:py-10 ${className}`}
      style={{ backgroundColor: colors.lightGrey }}
    >
      <div className="mx-auto w-full max-w-[320px]">
        {children}
      </div>
    </div>
  );
};

export default Card;
