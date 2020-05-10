import { Meal } from '../meal/meal';

export class Order {
  public id: number;
  public order_number: number;
  public ip_address: number;
  public customer_id: number;
  public total_amount: number;
  public meals: Meal[];

  public status: number;
}
