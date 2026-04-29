import colors from '../../config/colors';

export const Title = ({ text }) => {
  return (
    <div className="text-center mb-4">
      <h1
        className="text-[32px] font-[900] tracking-wider uppercase mb-0 font-sans"
        style={{ color: colors.primary }}
      >
        {text}
      </h1>
    </div>
  );
};

export default Title;
