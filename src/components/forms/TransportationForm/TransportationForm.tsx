import React, { useState } from 'react';
import { Card } from '../../ui/Card/Card';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import { CarbonEngine } from '../../../services/carbonEngine';
import type { TransportActivity, CarbonResult } from '../../../domain/types';
import { validateTransportInput } from '../../../domain/validation';
import { Explanation } from '../../ui/Explanation/Explanation';
import styles from './TransportationForm.module.css';

export const TransportationForm = () => {
  const [vehicleType, setVehicleType] = useState<TransportActivity['type']>('car_petrol');
  const [distance, setDistance] = useState('');
  const [frequency, setFrequency] = useState('');
  const [result, setResult] = useState<CarbonResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const input: Partial<TransportActivity> = {
      category: 'transport',
      type: vehicleType,
      distanceKm: Number(distance),
      frequencyPerWeek: Number(frequency)
    };

    const validationErrors = validateTransportInput(input);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    try {
      const calcResult = CarbonEngine.calculateTransport(input as TransportActivity);
      setResult(calcResult);
    } catch (err) {
      console.error(err);
      setErrors(['Calculation failed due to an unexpected error.']);
    }
  };

  return (
    <Card className={styles.container}>
      <h2>Transportation Footprint</h2>
      <p className={styles.description}>
        Calculate your estimated transportation footprint. We use documented category assumptions for calculation.
      </p>
      
      {errors.length > 0 && (
        <div className={styles.errorAlert} role="alert">
          <ul>
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formGroup}>
          <label htmlFor="vehicle-type" className={styles.label}>Vehicle Type *</label>
          <select 
            id="vehicle-type" 
            value={vehicleType} 
            onChange={(e) => setVehicleType(e.target.value as TransportActivity['type'])}
            className={styles.select}
            required
            aria-required="true"
          >
            <option value="car_petrol">Car (Petrol)</option>
            <option value="car_diesel">Car (Diesel)</option>
            <option value="car_ev">Car (Electric)</option>
            <option value="carpool">Carpool</option>
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
          helperText="How many days per week do you make this trip?"
        />

        <Button type="submit" fullWidth>Calculate Estimate</Button>
      </form>

      {result && (
        <Explanation result={result} />
      )}
    </Card>
  );
};
