import {Injectable} from "@nestjs/common";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm";
import {TestCaseResultEntity} from "../../Models/orm-entities";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class TestCaseResultService extends TypeOrmCrudService<TestCaseResultEntity> {
    constructor(
        @InjectRepository(TestCaseResultEntity)   repository
    ) {
        super(repository);
    }

}

