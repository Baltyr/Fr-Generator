import React, { forwardRef } from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className = '', ...props }, ref) => {
    const hasError = !!error;

    return (
      <div className="w-full">
        <div className="flex items-start">
          <div className="flex items-center h-6">
            <input
              ref={ref}
              type="checkbox"
              className={`
                w-5 h-5 rounded
                border-2 border-border
                bg-bg-card
                text-accent-purple
                focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:ring-accent-purple
                transition-all duration-200
                cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                ${hasError ? 'border-accent-red' : ''}
                ${className}
              `}
              {...props}
            />
          </div>

          {(label || description) && (
            <div className="ml-3">
              {label && (
                <label
                  className="block text-sm font-medium text-text-primary cursor-pointer select-none"
                  onClick={() => {
                    // Trigger checkbox click when label is clicked
                    const checkbox = document.getElementById(props.id || '');
                    if (checkbox) checkbox.click();
                  }}
                >
                  {label}
                  {props.required && <span className="text-accent-red ml-1">*</span>}
                </label>
              )}
              {description && (
                <p className="text-sm text-text-muted mt-0.5">{description}</p>
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-accent-red ml-8">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
