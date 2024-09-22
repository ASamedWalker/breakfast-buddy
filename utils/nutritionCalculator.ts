import { DetailedNutritionInfo } from "@/types";


export function calculateCalories(nutrition: DetailedNutritionInfo): number {
  // Calories per gram:
  // Protein: 4 calories/gram
  // Carbs (including sugar): 4 calories/gram
  // Fat: 9 calories/gram
  // Fiber: While it's a type of carbohydrate, it's generally considered to contribute about 2 calories/gram

  return Math.round(
    nutrition.protein * 4 +
    (nutrition.carbs - nutrition.fiber) * 4 + // Total carbs minus fiber
    nutrition.fat * 9 +
    nutrition.fiber * 2 + // Fiber contributes fewer calories
    nutrition.sugar * 4 // Sugar is already included in total carbs, but we're ensuring it's counted
  );
}