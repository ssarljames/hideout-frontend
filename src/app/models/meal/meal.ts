

export class Meal {
  id: string;
  name: string;

  meal_category_id: string;

  descrption: string;
  image_path_url: string;
  inventory_items: any[];
  drinks: any[];
  total_ordered: number;

  preparation_time: number;

  addons: MealAddon[];
}

export class MealAddon extends Meal {
  pivot: {
    add_on_price: number;
  }
}
