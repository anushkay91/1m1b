export type DataQuality = 'High' | 'Medium' | 'Low';
export type Category = 'transport' | 'electricity' | 'food' | 'shopping' | 'waste';

export interface EmissionFactor {
  id: string;
  category: Category;
  activity: string;
  factor: number;
  unit: string;
  geography?: string;
  source: string;
  sourceUrl?: string;
  methodology?: string;
  version: string;
  effectiveDate?: string;
}

export interface ActivityInput {
  category: Category;
}

export interface TransportActivity extends ActivityInput {
  category: 'transport';
  type: 'car_petrol' | 'car_diesel' | 'car_ev' | 'bus' | 'train' | 'carpool' | 'walk' | 'bicycle';
  distanceKm: number;
  frequencyPerWeek: number;
  occupancy?: number;
}

export interface ElectricityActivity extends ActivityInput {
  category: 'electricity';
  mode: 'accurate' | 'estimate';
  monthlyKwh?: number; // accurate mode
  // Estimate mode inputs
  acHoursPerDay?: number;
  fridgeCount?: number;
  washingMachineLoadsPerWeek?: number;
  tvHoursPerDay?: number;
}

export interface FoodActivity extends ActivityInput {
  category: 'food';
  redMeatMealsPerWeek: number;
  chickenMealsPerWeek: number;
  fishMealsPerWeek: number;
  dairyMealsPerWeek: number;
  plantBasedMealsPerWeek: number;
}

export interface ShoppingActivity extends ActivityInput {
  category: 'shopping';
  clothingItemsPerMonth: number;
  electronicsItemsPerMonth: number;
  furnitureItemsPerYear: number;
}

export interface WasteActivity extends ActivityInput {
  category: 'waste';
  plasticKgPerWeek: number;
  paperKgPerWeek: number;
  metalKgPerWeek: number;
  organicKgPerWeek: number;
  recycles: boolean;
}

export interface CarbonResult {
  category: Category;
  activity: string;
  estimatedCO2e: number;
  unit: string;
  dataQuality: DataQuality;
  inputs: Record<string, unknown>;
  emissionFactorId?: string;
  emissionFactorVersion?: string;
  assumptions: string[];
  methodology?: string;
}

export interface Goal {
  id: string;
  actionId: string;
  title: string;
  targetCount: number;
  currentCount: number;
  status: 'active' | 'completed' | 'abandoned';
  createdAt: string;
  completedAt?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: Category;
  estimatedPotentialReductionCO2e?: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  frequency: string;
  assumptions: string[];
}
