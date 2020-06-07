export interface ISteps {
  name: string;
  order: number;
  userId: string;
}
/// This is a listing inside of scenario just for info
export class Steps implements ISteps {
  constructor(public name: string, public order: number) {}

  public userId: string;
}
