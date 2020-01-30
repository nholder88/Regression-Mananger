
export class Scenario {
  constructor(
   public feature: string,
   public name: string,
   public result: boolean = false,
   public steps: Steps[] = [],
   public timestamp: Date = new Date(),
   public note: string = '',
   public order: number= 0,
   public id:string= ''
  ) {
  }

}

export class Steps {
  constructor( public name: string,public order: number) {

  }


}
