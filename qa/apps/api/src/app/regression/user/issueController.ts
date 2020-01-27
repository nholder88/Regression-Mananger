import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { IssueService } from './issue.service';
import { IssueEntity } from '../../Models/orm-entities';

@Crud({
  model: {
    type: IssueEntity
  }
})
@ApiTags('Issue')
@Controller('Issue')
export class IssueController {
  constructor(public service: IssueService) {}
}
