import React, { useState } from 'react';
import { Card } from '../../ui/Card/Card';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import { CarbonEngine } from '../../../services/carbonEngine';
import type { TransportInput, CalculationResult } from '../../../services/carbonEngine';
import styles from './TransportationForm.module.css';
import { Badge } from '../../ui/Badge/Badge';

export const TransportationForm = () => {
  const [vehicleType, setVehicleType] = useState<TransportInput['type']>('car_petrol');
  const [distance, setDistance] = useState('');
  const [frequency, setFrequency] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<{distance?: string, frequency?: string}>({});

  const validate = () => {
    const newErrors: {distance?: string, frequency?: string} = {};
    if (!distance || isNaN(Number(distance)) || Number(distance) < 0) {
      newErrors.distance = 'Please enter a valid positive distance.';
    }
    if (!frequency || isNaN(Number(frequency)) || Number(frequency) < 0 || Number(frequency) > 7) {
      newErrors.frequency = 'Please enter a valid frequency between 0 and 7.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const calcResult = CarbonEngine.calculateTransport({
          type: vehicleType,
          distanceKm: Number(distance),
          frequencyPerWeek: Number(frequency)
        });
        setResult(calcResult);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Card className={styles.container}>
      <h2>Transportation Footprint</h2>
      <p className={styles.description}>
        Calculate your estimated transportation footprint. We use documented category assumptions for calculation.
      </p>
      
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formGroup}>
          <label htmlFor="vehicle-type" className={styles.label}>Vehicle Type *</label>
          <select 
            id="vehicle-type" 
            value={vehicleType} 
            onChange={(e) => setVehicleType(e.target.value as TransportInput['type'])}
            className={styles.select}
            required
            aria-required="true"
          >
            <option value="car_petrol">Car (Petrol)</option>
            <option value="car_diesel">Car (Diesel)</option>
            <option value="car_ev">Car (Electric)</option>
            <option value="bus">Bus</option>
            <option value="train">Train</option>
          </select>
        </div>

        <Input 
          id="distance"
          label="Approximate Daily Distance (km)"
          type="number"
          min="0"
          step="0.1"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          required
          error={errors.distance}
          helperText="Enter the one-way distance in kilometers."
        />

        <Input 
          id="frequency"
          label="Frequency (days per week)"
          type="number"
          min="0"
          max="7"
          step="1"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          required
          error={errors.frequency}
          helperText="How many days per week do you make this trip?"
        />

        <Button type="submit" fullWidth>Calculate Estimate</Button>
      </form>

      {result && (
        <div className={styles.resultArea} role="region" aria-live="polite">
          <h3>Calculation Result</h3>
          <div className={styles.resultGrid}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Estimated CO₂e:</span>
              <span className={styles.resultValue}>~{Math.round(result.calculatedCO2e)} kg/year</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Data Quality:</span>
              <Badge variant={
                result.dataQuality === 'High' ? 'success' : 
                result.dataQuality === 'Medium' ? 'warning' : 'danger'
              }>
                {result.dataQuality}
              </Badge>
            </div>
          </div>
          <div className={styles.assumptions}>
            <strong>Assumptions:</strong> {result.assumptions}
            <br />
            <strong>Source:</strong> {result.factorUsed.source}
          </div>
        </div>
      )}
    </Card>
  );
};
