export interface UserPreferences {
  dietaryRestrictions: string[];
  allergies: string[];
  favoriteIngredients: string[];
  dislikedIngredients: string[];
  caloriePreference?: "low" | "medium" | "high";
}

export interface PreferencesFormProps {
  initialPreferences: UserPreferences;
  onSaved: (preferences: UserPreferences) => void;
}

export interface DetailedNutritionInfo {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

export interface Suggestion {
  item: string;
  description: string;
  source: string;
  estimatedPrice: string;
  calories: string;
}

export interface SavedSuggestion extends Suggestion {
  id: string;
  rating: number;
  date: string;
  isFavorite?: boolean;
  mood?: string;
  weather?: string;
}


export interface MealPlan {
  [date: string]: SavedSuggestion | null;
}

