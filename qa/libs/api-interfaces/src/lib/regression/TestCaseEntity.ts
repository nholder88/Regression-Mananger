import {Column, Entity, ObjectIdColumn} from "typeorm";
import {Status} from "./Status";

export interface TestCase {
  id: number;
  caseStatus: Status;
  caseOrder: number;
  description: string;
}

@Entity()
export class TestCaseEntity implements TestCase {
    @ObjectIdColumn() id: number;

    @Column() caseStatus: Status;
    @Column() caseOrder: number;
    @Column() description: string;
}
