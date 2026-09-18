import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  noPadding = false,
  ...props 
}) => {
  return (
    <div 
      className={clsx(styles.card, !noPadding && styles.padding, className)} 
      {...props}
    >
      {children}
    </div>
  );
};
