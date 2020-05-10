import { UserGroup } from '../user-group/user-group';

export class ComputerStation {
  public id: number;
  public name: string;
  public ip_address: string;
  public user_group_id: number;

  public user_group: UserGroup;
}
