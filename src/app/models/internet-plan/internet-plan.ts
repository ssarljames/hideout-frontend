import {Model} from '../model/model';

export class InternetPlan extends Model {

  name: string;
  description: string;
  bill: number;
  recurring_schedule: string;
  active_subscribers: number;

  afterConstructed(): void {

  }
}
