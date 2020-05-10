export class Meal {
  public id: string;
  public name: string;

  public meal_category_id: string;

  public descrption: string;
  public image_path_url: string;
  public inventory_items: any[];
  public drinks: any[];
  public total_ordered: number;

  public preparation_time: number;

  public pivot: any;
}
