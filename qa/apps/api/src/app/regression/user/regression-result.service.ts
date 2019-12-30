import {Injectable} from "@nestjs/common";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm";
import {RegressionResultEntity} from "../../Models/orm-entities";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class RegressionResultService extends TypeOrmCrudService<RegressionResultEntity> {
    constructor(
        @InjectRepository(RegressionResultEntity)   repository
    ) {
        super(repository);
    }

}

