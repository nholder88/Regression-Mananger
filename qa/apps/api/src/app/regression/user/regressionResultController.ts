import {Crud} from "@nestjsx/crud";
import {RegressionResultEntity, RolesEntity} from "../../Models/orm-entities";
import {ApiTags} from "@nestjs/swagger";
import {Controller} from "@nestjs/common";
import {RegressionResultService} from "./regression-result.service";

@Crud({
    model: {
        type: RegressionResultEntity
    }
})
@ApiTags('RegressionResult')
@Controller('RegressionResult')
export class RegressionResultController {
    constructor(public service: RegressionResultService) {
    }
}
