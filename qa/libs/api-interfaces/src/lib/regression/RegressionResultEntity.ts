import {Column, Entity, ObjectIdColumn} from "typeorm";
import {User, UserEntity} from "./User";
import {Test, TestEntity} from "./TestEntity";

export interface RegressionResult {
  id: number;
  tester: User;
  isComplete: boolean;
  tests: Test[];
}

@Entity()
export class RegressionResultEntity implements RegressionResult {
    @ObjectIdColumn() id: number;

    @Column(type => UserEntity) tester: User;

    @Column() isComplete: boolean;

    @Column(type => TestEntity) tests: TestEntity[];
}
