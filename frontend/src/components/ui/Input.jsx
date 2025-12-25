import React from 'react';

export default function Input({ label, type = "text", value, onChange, placeholder, error }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 mb-1 font-sans">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 rounded-lg border bg-white text-primary placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent
          transition-all duration-200 ease-in-out font-sans
          ${error ? 'border-red-500' : 'border-gray-200'}
        `}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}