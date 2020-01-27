import { Crud } from '@nestjsx/crud';
import { ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { RegressionEntity, TestCaseEntity, TestCaseResultEntity, TestEntity } from '../../Models/orm-entities';
import { TestService } from './test.service';
import { Regression, Test, TestCase, TestCaseResult, User } from '@qa/api-interfaces';
import { TestCaseService } from './test-case.service';
import { from } from 'rxjs';
import { RegressionService } from '../regression.service';

export class CreateRunDTO{
  @ApiProperty()
  regressionId: number;
  @ApiProperty()
  featureIds: Array<number>;
  @ApiProperty()
  createUser: User;
}

@Crud({
  model: {
    type: TestEntity
  }
})
@ApiTags('Test')
@Controller('Test')
export class TestController {
  constructor(
    public service: TestService,
    private caseService: TestCaseService,
    private regressionService: RegressionService
  ) {}

  @Post('CreateTestRuns')
  @ApiBody({type: [CreateRunDTO]})
  CreateTestRunsFromIds(
    @Body()
   createRunDTO:CreateRunDTO
  ) {
    // Create a Test
    let test: TestEntity;
    // @ts-ignore
    test = { testCases: [], tester: createRunDTO.createUser, isComplete: false, id: null };

    createRunDTO.featureIds.forEach(feature => {
      // Create blank results for each result
      let testCases: TestCaseEntity[];
      //get all test cases from all the feature
      from(this.caseService.find({ feature: { id: feature } })).subscribe(
        cases => (testCases = cases),
        error => console.log(error)
      );
      const results: TestCaseResultEntity[] = testCases.map(c => ({
        testCase: {...c},
        caseStatus: '',
        testingRole: '',
        testingLoginUserName: '',
        id: null,
        tests:test
      }));
      results.forEach(r => test.testCases.push(r));
    });
    let regression:RegressionEntity;
    from(this.regressionService.findOne({id:createRunDTO.regressionId})).subscribe(
      reg=> regression=reg
    );
    regression.results.push(test);
   from( this.regressionService.updateOne({ options: undefined, parsed: undefined }, regression)).subscribe(x=> console.log(x), error => {console.log(error)});
   return regression;
  }

}
