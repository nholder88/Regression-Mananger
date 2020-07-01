import { BaseModel } from './baseModel';

export interface ISteps extends BaseModel {
  id: string
  name: string;
  order: number;
  userId: string;
}

/// This is a listing inside of scenario just for info
export class Steps implements ISteps {
  constructor(public name: string, public order: number) {
  }

  public id: string;
  public userId: string;
}
