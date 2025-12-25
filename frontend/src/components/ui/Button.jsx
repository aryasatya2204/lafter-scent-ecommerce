import React from 'react';

export default function Button({ children, onClick, type = "button", isLoading = false, fullWidth = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`
        flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300
        ${fullWidth ? 'w-full' : ''}
        ${isLoading 
          ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
          : 'bg-secondary hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
        }
      `}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
      ) : null}
      <span className="font-serif tracking-wide">{children}</span>
    </button>
  );
}