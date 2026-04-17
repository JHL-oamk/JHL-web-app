/**
 * Loading Spinner Component
 */

export const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      <p className="mt-3 text-black text-sm">{message}</p>
    </div>
  );
};
