import factorsData from '../../data/factors_v1.json';

export type FactorConfidence = 'High' | 'Medium' | 'Low';
export type Category = 'transport' | 'electricity' | 'food' | 'shopping' | 'waste';

export interface FactorInfo {
  category: string;
  activity: string;
  unit: string;
  factor_value: number;
  unit_co2e: string;
  source: string;
  confidence: FactorConfidence;
}

export interface CalculationResult {
  category: Category;
  inputQuantity: number;
  inputUnit: string;
  calculatedCO2e: number;
  factorUsed: FactorInfo;
  assumptions: string;
  dataQuality: FactorConfidence;
}

export interface TransportInput {
  type: 'car_petrol' | 'car_diesel' | 'car_ev' | 'bus' | 'train';
  distanceKm: number;
  frequencyPerWeek: number;
}

export interface ElectricityInput {
  mode: 'accurate' | 'estimate';
  monthlyKwh?: number; // For accurate mode
  heavyAppliancesHoursPerWeek?: number; // For estimate mode
  lightAppliancesHoursPerWeek?: number; // For estimate mode
}

export interface FoodInput {
  redMeatMealsPerWeek: number;
  chickenMealsPerWeek: number;
  plantBasedMealsPerWeek: number;
}

export interface ShoppingInput {
  clothingItemsPerMonth: number;
  electronicItemsPerMonth: number;
}

export interface WasteInput {
  plasticKgPerWeek: number;
  paperKgPerWeek: number;
}

const factors: Record<string, Record<string, FactorInfo>> = factorsData.factors as any;

export class CarbonEngine {
  
  static calculateTransport(input: TransportInput): CalculationResult {
    const factor = factors.transport[input.type];
    if (!factor) throw new Error(`Unknown transport type: ${input.type}`);
    
    // Calculate annualized emissions
    const annualDistance = input.distanceKm * input.frequencyPerWeek * 52;
    const co2e = annualDistance * factor.factor_value;

    return {
      category: 'transport',
      inputQuantity: annualDistance,
      inputUnit: 'km/year',
      calculatedCO2e: co2e,
      factorUsed: factor,
      assumptions: `Assumes average ${input.type} emissions per km without traffic multipliers.`,
      dataQuality: factor.confidence
    };
  }

  static calculateElectricity(input: ElectricityInput): CalculationResult {
    if (input.mode === 'accurate' && input.monthlyKwh !== undefined) {
      const factor = factors.electricity.grid_average;
      const annualKwh = input.monthlyKwh * 12;
      return {
        category: 'electricity',
        inputQuantity: annualKwh,
        inputUnit: 'kWh/year',
        calculatedCO2e: annualKwh * factor.factor_value,
        factorUsed: factor,
        assumptions: 'Based on actual provided bill data annualized.',
        dataQuality: 'High'
      };
    } else {
      // Estimate mode
      const heavyFactor = factors.electricity.appliance_heavy;
      const lightFactor = factors.electricity.appliance_light;
      
      const heavyHours = (input.heavyAppliancesHoursPerWeek || 0) * 52;
      const lightHours = (input.lightAppliancesHoursPerWeek || 0) * 52;
      
      const heavyEmissions = heavyHours * heavyFactor.factor_value;
      const lightEmissions = lightHours * lightFactor.factor_value;

      return {
        category: 'electricity',
        inputQuantity: heavyHours + lightHours,
        inputUnit: 'appliance hours/year',
        calculatedCO2e: heavyEmissions + lightEmissions,
        factorUsed: heavyFactor, // Simplified for result
        assumptions: 'Estimated from self-reported appliance usage. Power ratings are category defaults.',
        dataQuality: 'Low'
      };
    }
  }

  static calculateFood(input: FoodInput): CalculationResult {
    const redMeat = factors.food.red_meat;
    const chicken = factors.food.chicken;
    const plant = factors.food.plant_based;

    const annualRedMeat = input.redMeatMealsPerWeek * 52;
    const annualChicken = input.chickenMealsPerWeek * 52;
    const annualPlant = input.plantBasedMealsPerWeek * 52;

    const co2e = 
      (annualRedMeat * redMeat.factor_value) + 
      (annualChicken * chicken.factor_value) +
      (annualPlant * plant.factor_value);

    return {
      category: 'food',
      inputQuantity: annualRedMeat + annualChicken + annualPlant,
      inputUnit: 'meals/year',
      calculatedCO2e: co2e,
      factorUsed: plant, // Arbitrary representation
      assumptions: 'Based on frequency categories and average portion lifecycle emissions.',
      dataQuality: 'Medium'
    };
  }

  static calculateShopping(input: ShoppingInput): CalculationResult {
    const clothing = factors.shopping.clothing;
    const electronics = factors.shopping.electronics;

    const annualClothing = input.clothingItemsPerMonth * 12;
    const annualElectronics = input.electronicItemsPerMonth * 12;

    const co2e = 
      (annualClothing * clothing.factor_value) +
      (annualElectronics * electronics.factor_value);

    return {
      category: 'shopping',
      inputQuantity: annualClothing + annualElectronics,
      inputUnit: 'items/year',
      calculatedCO2e: co2e,
      factorUsed: clothing,
      assumptions: 'Using category-level lifecycle estimates without specific item materials.',
      dataQuality: 'Low'
    };
  }

  static calculateWaste(input: WasteInput): CalculationResult {
    const plastic = factors.waste.plastic;
    const paper = factors.waste.paper;

    const annualPlastic = input.plasticKgPerWeek * 52;
    const annualPaper = input.paperKgPerWeek * 52;

    const co2e = 
      (annualPlastic * plastic.factor_value) + 
      (annualPaper * paper.factor_value);

    return {
      category: 'waste',
      inputQuantity: annualPlastic + annualPaper,
      inputUnit: 'kg/year',
      calculatedCO2e: co2e,
      factorUsed: plastic,
      assumptions: 'Based on estimated mass of waste streams to landfill.',
      dataQuality: 'Low'
    };
  }
}
