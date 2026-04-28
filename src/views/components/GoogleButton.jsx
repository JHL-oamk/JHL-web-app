import { FcGoogle } from "react-icons/fc";

export const GoogleButton = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        w-full
        flex items-center justify-center
        gap-3
        bg-white
        border border-gray-300
        py-2.5 px-4
        rounded
        shadow-sm
        hover:bg-gray-50
        active:bg-gray-100
        transition
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      <FcGoogle size={20} />
      
      <span className="text-sm font-medium text-gray-700">
        Sign in with Google
      </span>
    </button>
  );
};