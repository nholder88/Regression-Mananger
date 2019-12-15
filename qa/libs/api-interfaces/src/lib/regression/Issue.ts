import {Entity, ObjectIdColumn} from "typeorm";

export interface IssueInterface {
  id: number;
}

@Entity()
export class Issue implements IssueInterface {
    @ObjectIdColumn() id: number;
}
