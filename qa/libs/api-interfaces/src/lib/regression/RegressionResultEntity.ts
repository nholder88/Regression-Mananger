import {Column, Entity, ObjectIdColumn} from "typeorm";
import {User, UserEntity} from "./User";
import {TestEntity} from "./TestEntity";

export interface RegressionResult {
  id: number;
  tester: User;
  isComplete: boolean;
  tests: TestEntity[];
}

@Entity()
export class RegressionResultEntity implements RegressionResult {
    @ObjectIdColumn() id: number;

    @Column(type => UserEntity) tester: User;

    @Column() isComplete: boolean;

    @Column(type => TestEnt) tests: TestEntity[];
}
