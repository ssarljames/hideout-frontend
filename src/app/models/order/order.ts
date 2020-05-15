import { Meal } from '../meal/meal';

export class Order {
  public id: number;
  public order_number: number;
  public ip_address: number;
  public customer_id: number;
  public total_amount: number;
  public meals: MealOrdered[];

  public status: number;
}


export class MealOrdered extends Meal {
  pivot: {
    id
    order_id: number;
    meal_id: number;
    quantity: number;
    current_price: number;
    total_amount: number;
    customer_remarks: string;
    status: any;
    is_add_on: boolean;
    main_order_meal_id: string;
  }
}
