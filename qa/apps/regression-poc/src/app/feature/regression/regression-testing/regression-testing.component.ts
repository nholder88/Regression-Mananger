import { Component, OnInit } from '@angular/core';
import { Regression, Test } from '@qa/api-interfaces';
import { RegressionService } from '../regression.service';

@Component({
  selector: 'qa-regression-testing',
  templateUrl: './regression-testing.component.html',
  styleUrls: ['./regression-testing.component.css']
})
export class RegressionTestingComponent implements OnInit {
  test: Test = {
    id: 0,
    isComplete: false,
    tester: {
      id: 0,
      name: 'Joe test',
      roles: [],
      lastLogin: null,
      team: { id: 1, name: 'thesis' }
    },
    testCases: [{
      id: 0,
      caseStatus: '',
      testCase: {
        id: 10,
        feature: { id: 0, name: 'Billing', enable: true, teams: [], subFeatures: [] },
        caseOrder: 1,
        description: 'Spicy jalapeno bacon ipsum dolor amet fatback excepteur salami do pork belly landjaeger ground round minim kevin anim ea alcatra nisi labore.'
      },
      testingLoginUserName: '',
      testingRole: ''
    },
      {
        id: 0,
        caseStatus: '',
        testCase: {
          id: 10,
          feature: { id: 0, name: 'Letters', enable: true, teams: [], subFeatures: [] },
          caseOrder: 12,
          description: 'Kevin pork belly pancetta, occaecat minim duis cupim tail shankle capicola alcatra bresaola sed exercitation dolor'
        },
        testingLoginUserName: '',
        testingRole: ''
      },
      {
        id: 0,
        caseStatus: '',
        testCase: {
          id: 10,
          feature: { id: 0, name: 'Letters', enable: true, teams: [], subFeatures: [] },
          caseOrder: 13,
          description: 'Commodo tempor minim labore, sirloin ut pariatur non sunt id ullamco dolore flank tri-tip.'
        },
        testingLoginUserName: '',
        testingRole: ''
      },
      {
        id: 0,
        caseStatus: '',
        testCase: {
          id: 10,
          feature: { id: 0, name: 'Letters', enable: true, teams: [], subFeatures: [] },
          caseOrder: 14,
          description: 'Meatloaf tongue voluptate short loin.'
        },
        testingLoginUserName: '',
        testingRole: ''
      },
      {
        id: 0,
        caseStatus: '',
        testCase: {
          id: 10,
          feature: { id: 0, name: 'Northwell Integration', enable: true, teams: [], subFeatures: [] },
          caseOrder: 15,
          description: 'Est corned beef tempor ham hock cillum pancetta irure sausage boudin hamburger ex incididunt.'
        },
        testingLoginUserName: '',
        testingRole: ''
      },
      {
        id: 0,
        caseStatus: '',
        testCase: {
          id: 10,
          feature: { id: 0, name: 'Northwell Integration', enable: true, teams: [], subFeatures: [] },
          caseOrder: 16,
          description: 'Pariatur magna voluptate landjaeger tri-tip. Minim sint proident ball tip buffalo.'
        },
        testingLoginUserName: '',
        testingRole: ''
      },
      {
        id: 0,
        caseStatus: '',
        testCase: {
          id: 10,
          feature: { id: 0, name: 'Northwell Integration', enable: true, teams: [], subFeatures: [] },
          caseOrder: 17,
          description: 'Ribeye deserunt filet mignon prosciutto.'
        },
        testingLoginUserName: '',
        testingRole: ''
      },
      {
        id: 0,
        caseStatus: '',
        testCase: {
          id: 10,
          feature: { id: 0, name: 'Other', enable: true, teams: [], subFeatures: [] },
          caseOrder: 18,
          description: 'Cupim beef picanha nostrud tri-tip, ullamco et swine deserunt chislic cillum prosciutto.'
        },
        testingLoginUserName: '',
        testingRole: ''
      }]
  };
  regression: Regression = {
    id: 0,
    results: [this.test],
    actualEndDate: null,
    actualStartDate: null,
    isComplete: false,
    isStarted: true,
    name: 'test',
    plannedEndDate: null,
    plannedStartDate: null,
    practiceName: 'Master',
    releaseName: 'Never'
  };
  regression$ = this.service.regressionWithAdd$;
  constructor(private service: RegressionService) {
  }

  ngOnInit() {
  }
}
