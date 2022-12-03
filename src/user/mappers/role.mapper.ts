import { Role } from '../entity/role.entity';
import { RoleDto } from '../dto/role.dto';

export class RoleMapper {
  public mapToNewRole(name: string): Role {
    const role: Role = new Role();
    role.name = name;
    return role;
  }

  public mapToRoleDto(role: Role): RoleDto {
    const roleDto: RoleDto = new RoleDto();
    roleDto.name = role.name;
    return roleDto;
  }

  public mapToRoleDtoArray(roles: Role[]): RoleDto[] {
    if (!roles) return null;
    const rolesDto: RoleDto[] = [];
    roles.forEach((Role) => {
      rolesDto.push(this.mapToRoleDto(Role));
    });
    return rolesDto;
  }
}
