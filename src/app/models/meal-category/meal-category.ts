import { Meal } from '../meal/meal';

export class MealCategory {
  public id: string;
  public name: string;
  public meals: Meal[];

  public available: boolean;
  public available_meal_count: number;
  public is_indeterminate: boolean;
}
