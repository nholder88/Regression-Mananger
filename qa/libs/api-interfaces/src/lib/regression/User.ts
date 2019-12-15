import {Column, Entity, ObjectIdColumn} from "typeorm";

export interface User {
  id: number;
  team: string;
  name: string;
  roles: string[];
  lastLogin: Date;
}

@Entity()
export class UserEntity implements User {
    @ObjectIdColumn() id: number;
    @Column() team: string;

    @Column() name: string;
    @Column() roles: string[];
    @Column() lastLogin: Date;
}
