import React from 'react';
import type { CarbonResult } from '../../../domain/types';
import { Badge } from '../Badge/Badge';
import styles from './Explanation.module.css';

interface ExplanationProps {
  result: CarbonResult;
}

export const Explanation: React.FC<ExplanationProps> = ({ result }) => {
  const badgeVariant = 
    result.dataQuality === 'High' ? 'success' : 
    result.dataQuality === 'Medium' ? 'warning' : 'danger';

  return (
    <div className={styles.container} role="region" aria-live="polite">
      <h3>Calculation Result</h3>
      
      <div className={styles.grid}>
        <div className={styles.item}>
          <span className={styles.label}>Estimated CO₂e:</span>
          <span className={styles.value}>
            ~{Math.round(result.estimatedCO2e)} {result.unit}
          </span>
        </div>
        
        <div className={styles.item}>
          <span className={styles.label}>Data Quality:</span>
          <div className={styles.badgeWrapper}>
            <Badge variant={badgeVariant}>{result.dataQuality}</Badge>
          </div>
        </div>
      </div>

      <div className={styles.methodology}>
        <h4>How was this estimated?</h4>
        <div className={styles.inputs}>
          <strong>Data Used:</strong>
          <ul>
            {Object.entries(result.inputs).map(([key, value]) => {
              if (key === 'category') return null;
              return <li key={key}>{key}: {String(value)}</li>;
            })}
          </ul>
        </div>
        
        <div className={styles.assumptions}>
          <strong>Assumptions:</strong>
          <ul>
            {result.assumptions.map((assumption, index) => (
              <li key={index}>{assumption}</li>
            ))}
          </ul>
        </div>
        
        <div className={styles.source}>
          <strong>Methodology Source:</strong> {result.methodology}
        </div>
      </div>
    </div>
  );
};
