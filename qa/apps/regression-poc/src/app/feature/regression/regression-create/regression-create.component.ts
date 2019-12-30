import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'qa-regression-create',
  templateUrl: './regression-create.component.html',
  styleUrls: ['./regression-create.component.css']
})
export class RegressionCreateComponent implements OnInit {

  exampleForm = new FormGroup({
    sample: new FormControl('', Validators.required),
  });
  constructor() { }

  ngOnInit() {
  }

}
