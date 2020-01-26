import { Crud } from '@nestjsx/crud';
import { RolesEntity } from '../../Models/orm-entities';
import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { RoleService } from './role.service';

@Crud({
  model: {
    type: RolesEntity
  }
})
@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(public service: RoleService) {}
}
