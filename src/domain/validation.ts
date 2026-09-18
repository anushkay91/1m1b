import type { TransportActivity, ElectricityActivity, FoodActivity, ShoppingActivity, WasteActivity } from './types';

export const validateTransportInput = (input: Partial<TransportActivity>): string[] => {
  const errors: string[] = [];
  
  if (!input.type) {
    errors.push('Transport mode is required.');
  }
  
  if (input.distanceKm === undefined || isNaN(input.distanceKm) || input.distanceKm < 0) {
    errors.push('Distance must be a valid positive number.');
  }

  if (input.frequencyPerWeek === undefined || isNaN(input.frequencyPerWeek) || input.frequencyPerWeek < 0 || input.frequencyPerWeek > 7) {
    errors.push('Frequency must be between 0 and 7 days a week.');
  }

  if (input.occupancy !== undefined && (isNaN(input.occupancy) || input.occupancy < 1)) {
    errors.push('Occupancy must be at least 1 person.');
  }

  return errors;
};

export const validateElectricityInput = (input: Partial<ElectricityActivity>): string[] => {
  const errors: string[] = [];
  
  if (!input.mode) {
    errors.push('Electricity entry mode is required.');
  }
  
  if (input.mode === 'accurate') {
    if (input.monthlyKwh === undefined || isNaN(input.monthlyKwh) || input.monthlyKwh < 0) {
      errors.push('Monthly kWh must be a valid positive number.');
    }
  } else if (input.mode === 'estimate') {
    if (input.acHoursPerDay !== undefined && (isNaN(input.acHoursPerDay) || input.acHoursPerDay < 0 || input.acHoursPerDay > 24)) {
      errors.push('AC hours per day must be between 0 and 24.');
    }
    if (input.fridgeCount !== undefined && (isNaN(input.fridgeCount) || input.fridgeCount < 0)) {
      errors.push('Fridge count must be 0 or more.');
    }
  }

  return errors;
};

export const validateFoodInput = (input: Partial<FoodActivity>): string[] => {
  const errors: string[] = [];
  const fields: (keyof FoodActivity)[] = ['redMeatMealsPerWeek', 'chickenMealsPerWeek', 'fishMealsPerWeek', 'dairyMealsPerWeek', 'plantBasedMealsPerWeek'];
  
  for (const field of fields) {
    const val = input[field];
    if (val !== undefined && (isNaN(Number(val)) || Number(val) < 0 || Number(val) > 21)) {
      errors.push(`${field} must be between 0 and 21 meals per week.`);
    }
  }

  return errors;
};

export const validateShoppingInput = (input: Partial<ShoppingActivity>): string[] => {
  const errors: string[] = [];
  
  if (input.clothingItemsPerMonth !== undefined && (isNaN(input.clothingItemsPerMonth) || input.clothingItemsPerMonth < 0)) {
    errors.push('Clothing items must be a positive number.');
  }
  if (input.electronicsItemsPerMonth !== undefined && (isNaN(input.electronicsItemsPerMonth) || input.electronicsItemsPerMonth < 0)) {
    errors.push('Electronics items must be a positive number.');
  }
  if (input.furnitureItemsPerYear !== undefined && (isNaN(input.furnitureItemsPerYear) || input.furnitureItemsPerYear < 0)) {
    errors.push('Furniture items must be a positive number.');
  }

  return errors;
};

export const validateWasteInput = (input: Partial<WasteActivity>): string[] => {
  const errors: string[] = [];
  const fields: (keyof WasteActivity)[] = ['plasticKgPerWeek', 'paperKgPerWeek', 'metalKgPerWeek', 'organicKgPerWeek'];
  
  for (const field of fields) {
    const val = input[field];
    if (val !== undefined && (isNaN(Number(val)) || Number(val) < 0)) {
      errors.push(`${field} must be a valid positive number.`);
    }
  }

  return errors;
};
