import React from "react";

interface TogglePasswordButtonProps {
    showPassword: boolean;
    togglePassword: () => void;
    topOffset?: string; // Optional styling override
}

const TogglePasswordButton: React.FC<TogglePasswordButtonProps> = ({
    showPassword,
    togglePassword,
    topOffset = "top-[30px]",
}) => {
    return (
        <button
            type="button"
            onClick={togglePassword}
            className={`absolute inset-y-0 right-2 ${topOffset} flex items-center text-sm text-blue-600 focus:outline-none`}
        >
            {showPassword ? (
                <svg
                    className="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.27 3.27a.75.75 0 0 1 1.06 0l16.5 16.5a.75.75 0 0 1-1.06 1.06l-2.21-2.21a9.75 9.75 0 0 1-12.84-1.23A11.25 11.25 0 0 1 1.47 12a11.27 11.27 0 0 1 4.22-5.83L3.27 4.33a.75.75 0 0 1 0-1.06Zm5.2 6.26a3.75 3.75 0 0 0 5.02 5.02l-5.02-5.02Zm10.41 7.3-3.37-3.36a3.75 3.75 0 0 0-4.64-4.64L9.38 7.88a9.77 9.77 0 0 1 2.62-.38 9.75 9.75 0 0 1 9.1 6.25 11.22 11.22 0 0 1-2.62 3.81Z"
                    />
                </svg>
            ) : (
                <svg
                    className="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
                </svg>
            )}
        </button>
    );
};

export default TogglePasswordButton;