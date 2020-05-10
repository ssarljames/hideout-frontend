import { Moment } from 'moment';
export class Outbox {
  public id: string;
  public sent_at: Moment;
  public receiver: string;
  public message: string;

  public created_at: Moment;

  public checked: boolean;
}
