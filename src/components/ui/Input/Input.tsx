import React, { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className={clsx(styles.wrapper, className)}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {props.required && <span className={styles.required}> *</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={clsx(styles.input, error && styles.inputError)}
          aria-invalid={!!error}
          aria-describedby={
            clsx(error && errorId, helperText && !error && helperId) || undefined
          }
          {...props}
        />
        {error ? (
          <span id={errorId} className={styles.error} role="alert">
            {error}
          </span>
        ) : helperText ? (
          <span id={helperId} className={styles.helper}>
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
