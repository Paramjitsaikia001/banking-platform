// src/components/common/InputField.jsx
import React from 'react';

const InputField = ({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  icon = null,
  error = null,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full rounded-lg border py-2
            ${icon ? 'pl-10' : 'pl-3'} 
            pr-3 shadow-sm
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            disabled:bg-gray-100 disabled:text-gray-500
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;