import type { 
  TransportActivity, 
  ElectricityActivity, 
  FoodActivity, 
  CarbonResult, 
  EmissionFactor 
} from '../../domain/types';
import factorsData from '../../data/emissionFactors/factors_v1.json';

// In-memory indexing of the versioned factors
const factorsList = factorsData.factors as EmissionFactor[];
const getFactor = (id: string): EmissionFactor => {
  const factor = factorsList.find(f => f.id === id);
  if (!factor) throw new Error(`Emission factor ${id} not found in dataset.`);
  return factor;
};

export class CarbonEngine {
  
  static calculateTransport(input: TransportActivity): CarbonResult {
    let factorId = '';
    let assumptions: string[] = [];
    let dataQuality: 'High' | 'Medium' | 'Low' = 'Medium';

    switch (input.type) {
      case 'car_petrol':
        factorId = 'ef_trans_car_petrol';
        break;
      case 'car_ev':
        factorId = 'ef_trans_car_ev';
        dataQuality = 'High';
        break;
      case 'bus':
        factorId = 'ef_trans_bus';
        break;
      case 'carpool':
        factorId = 'ef_trans_carpool_petrol';
        assumptions.push('Assumes 2 passengers splitting the footprint of an average petrol car.');
        break;
      default:
        factorId = 'ef_trans_car_petrol';
        dataQuality = 'Low';
        assumptions.push('Fallback to average petrol car due to unknown detailed factor.');
    }

    const factor = getFactor(factorId);
    
    // Normalize units (annualize)
    const annualDistance = input.distanceKm * input.frequencyPerWeek * 52;
    const co2e = annualDistance * factor.factor;

    assumptions.push(`Calculated using factor: ${factor.methodology}`);

    return {
      category: 'transport',
      activity: 'Annual commute tracking',
      estimatedCO2e: co2e,
      unit: 'kg CO₂e/year',
      dataQuality,
      inputs: { ...input },
      emissionFactorId: factor.id,
      emissionFactorVersion: factor.version,
      assumptions,
      methodology: factor.source
    };
  }

  static calculateElectricity(input: ElectricityActivity): CarbonResult {
    const gridFactor = getFactor('ef_elec_grid');
    
    if (input.mode === 'accurate' && input.monthlyKwh !== undefined) {
      const annualKwh = input.monthlyKwh * 12;
      return {
        category: 'electricity',
        activity: 'Household Electricity (Bill)',
        estimatedCO2e: annualKwh * gridFactor.factor,
        unit: 'kg CO₂e/year',
        dataQuality: 'High',
        inputs: { ...input },
        emissionFactorId: gridFactor.id,
        emissionFactorVersion: gridFactor.version,
        assumptions: ['Annualized from actual provided monthly kWh.', `Grid factor: ${gridFactor.methodology}`],
        methodology: gridFactor.source
      };
    } else {
      // Basic Appliance Estimation Fallback
      // Standard assumptions for power ratings if unknown
      const acPowerKw = 1.5;
      const fridgePowerKw = 0.15; // continuously running
      const acHours = (input.acHoursPerDay || 0) * 365;
      const fridgeHours = (input.fridgeCount || 0) * 24 * 365;
      
      const estimatedAnnualKwh = (acPowerKw * acHours) + (fridgePowerKw * fridgeHours);

      return {
        category: 'electricity',
        activity: 'Household Electricity (Estimated)',
        estimatedCO2e: estimatedAnnualKwh * gridFactor.factor,
        unit: 'kg CO₂e/year',
        dataQuality: 'Medium',
        inputs: { ...input },
        emissionFactorId: gridFactor.id,
        emissionFactorVersion: gridFactor.version,
        assumptions: [
          'Estimated kWh from self-reported appliance usage.',
          `Assumed AC power: ${acPowerKw}kW`,
          `Assumed Fridge power: ${fridgePowerKw}kW`,
          `Grid factor: ${gridFactor.methodology}`
        ],
        methodology: gridFactor.source
      };
    }
  }

  static calculateFood(input: FoodActivity): CarbonResult {
    const redMeat = getFactor('ef_food_red_meat');
    const plantBased = getFactor('ef_food_plant_based');

    const annualRedMeat = input.redMeatMealsPerWeek * 52;
    const annualPlant = input.plantBasedMealsPerWeek * 52;

    const co2e = 
      (annualRedMeat * redMeat.factor) + 
      (annualPlant * plantBased.factor);

    return {
      category: 'food',
      activity: 'Dietary Estimate',
      estimatedCO2e: co2e,
      unit: 'kg CO₂e/year',
      dataQuality: 'Medium',
      inputs: { ...input },
      emissionFactorId: redMeat.id,
      emissionFactorVersion: redMeat.version,
      assumptions: [
        'Calculated based on weekly reported meal frequencies.',
        'Used global average footprints for meal types.',
        'Only red meat and plant-based included in current prototype.'
      ],
      methodology: redMeat.source
    };
  }
}
