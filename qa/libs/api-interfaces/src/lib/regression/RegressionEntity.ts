import {Column, Entity, ObjectIdColumn} from "typeorm";
import {RegressionResult, RegressionResultEntity} from "./RegressionResultEntity";

export interface Regression {
  id: number;
  name: string;
  releaseName: string;
  actualStartDate: Date;
  actualEndDate: Date;
  plannedStartDate: Date;
  plannedEndDate: Date;
  results: RegressionResult[];
  isComplete: boolean;
}

@Entity()
export class RegressionEntity implements Regression {
    @ObjectIdColumn() id: number;

    @Column() name: string;

    @Column() releaseName: string;

    @Column() actualStartDate: Date;
    @Column() actualEndDate: Date;
    @Column() plannedStartDate: Date;
    @Column() plannedEndDate: Date;

    @Column(type => RegressionResultEntity) results: RegressionResultEntity[];

    @Column() isComplete: boolean;
}
