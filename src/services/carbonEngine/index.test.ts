import { describe, it, expect } from 'vitest';
import { CarbonEngine } from './index';

describe('CarbonEngine', () => {
  it('calculates transport emissions correctly', () => {
    const result = CarbonEngine.calculateTransport({
      type: 'car_petrol',
      distanceKm: 12,
      frequencyPerWeek: 5
    });

    // 12 * 5 * 52 = 3120 km/year
    // 3120 * 0.192 = 599.04 kg CO2e
    expect(result.calculatedCO2e).toBeCloseTo(599.04);
    expect(result.dataQuality).toBe('Medium');
  });

  it('calculates electricity accurately when bill is provided', () => {
    const result = CarbonEngine.calculateElectricity({
      mode: 'accurate',
      monthlyKwh: 284
    });

    // 284 * 12 = 3408 kWh/year
    // 3408 * 0.4 = 1363.2 kg CO2e
    expect(result.calculatedCO2e).toBeCloseTo(1363.2);
    expect(result.dataQuality).toBe('High');
  });

  it('calculates food emissions', () => {
    const result = CarbonEngine.calculateFood({
      redMeatMealsPerWeek: 2,
      chickenMealsPerWeek: 5,
      plantBasedMealsPerWeek: 14
    });

    // red meat: 2 * 52 * 6.5 = 676
    // chicken: 5 * 52 * 1.2 = 312
    // plant: 14 * 52 * 0.5 = 364
    // total: 1352
    expect(result.calculatedCO2e).toBeCloseTo(1352);
  });
});
