import { Moment } from 'moment';
export class Inbox {
  public id: string;
  public received_at: Moment;
  public sender: string;
  public message: string;

  public checked: boolean;
}
