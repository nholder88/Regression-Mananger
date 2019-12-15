import {Column, Entity, ObjectIdColumn} from "typeorm";
import {TestCase, TestCaseEntity} from "./TestCaseEntity";

export interface Test {
  id: number;
  testCases: TestCase[];
  role: string;
  loginUserName: string;
  name: string;
  teamOwner: string;
  feature: string;
  area: string;
}


@Entity()
export class TestEntity implements Test {
    @ObjectIdColumn() id: number;
    @Column(type => TestCaseEntity) testCases: TestCaseEntity[];
    @Column() role: string;
    @Column() loginUserName: string;
    @Column() name: string;
    @Column() teamOwner: string;
    @Column() feature: string;
    @Column() area: string;
}
