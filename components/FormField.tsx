
import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  isTextarea?: boolean;
  children?: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, name, value, onChange, placeholder, isTextarea = false, children }) => {
  const commonProps = {
    name: name,
    id: name,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    className: `block w-full bg-slate-700/50 border border-slate-600 rounded-lg shadow-sm py-3 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${children ? 'pr-12' : ''}`
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
        {children}
      </div>
    </div>
  );
};

export default FormField;
