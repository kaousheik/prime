import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ObjectType, ID, Field } from "type-graphql";
import { DepartmentType } from "../enums/DepartmentType.enum";

@Entity()
@ObjectType()
export class Department extends BaseEntity{
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    _id: number

    @Column()
    @Field(() => DepartmentType)
    name: DepartmentType

    // @Field({nullable: true})
    // @Column({nullable: true})
    // members: 
}