import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  isTextarea?: boolean;
  children?: React.ReactNode;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>; // For when the user clicks away
  disabled?: boolean; // To disable the input
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  isTextarea = false,
  children
}) => {
  const commonProps = {
    name,
    id: name,
    value,
    onChange,
    placeholder,
    className:
      `block w-full bg-slate-700/50 border border-slate-600 rounded-lg shadow-sm 
       py-3 px-4 text-slate-200 placeholder-slate-500 
       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
       transition-colors ${children ? 'pr-12' : ''}`
       
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-slate-400">
        {label}
      </label>
      <div className="relative">
        {isTextarea ? (
          <textarea {...commonProps} rows={4} />
        ) : (
          <input type="text" {...commonProps} />
        )}
        {children && <div className="absolute inset-y-0 right-3 flex items-center">{children}</div>}
      </div>
    </div>
    
  );
};

export default FormField;
