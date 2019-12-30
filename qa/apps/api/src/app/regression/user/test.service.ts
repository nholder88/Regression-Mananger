import {Injectable} from "@nestjs/common";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm";
import {TestEntity} from "../../Models/orm-entities";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class TestService extends TypeOrmCrudService<TestEntity> {
    constructor(
        @InjectRepository(TestEntity)   repository
    ) {
        super(repository);
    }

}
