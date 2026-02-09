export type MealDBListResponse = {
  meals: MealSummary[] | null;
};

export type MealDBLookupResponse = {
  meals: MealDetail[] | null;
};

export type MealSummary = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export type MealDetail = MealSummary & {
  strCategory?: string | null;
  strArea?: string | null;
  strInstructions?: string | null;
  strYoutube?: string | null;
  strSource?: string | null;
  ingredients: Ingredient[];
};

export type Ingredient = {
  name: string;
  measure: string;
};
