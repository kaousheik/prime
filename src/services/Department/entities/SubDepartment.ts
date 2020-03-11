import { Entity, PrimaryGeneratedColumn, Column,  BaseEntity, ManyToOne } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Department } from "./Department";
// import { Department } from "./Department";
// import { Department } from "./Department";

@Entity()
@ObjectType()
export class SubDepartment extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    _id: number

    @Column()
    @Field()
    name: string

    @ManyToOne(() => Department, {nullable: true})
    department?: Department
// }
}