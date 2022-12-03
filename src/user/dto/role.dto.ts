import { CreateRoleRequest } from '../user.pb';
import { IsString } from 'class-validator';

export class RoleDto {
  public name: string;
}

export class CreateRoleDto implements CreateRoleRequest {
  @IsString()
  name: string;
}
