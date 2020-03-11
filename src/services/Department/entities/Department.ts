import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ObjectType, ID, Field } from "type-graphql";
import { SubDepartment } from "./SubDepartment";
// import { SubDepartment } from "./SubDepartment";
// import { DepartmentType } from "../enums/DepartmentType.enum";

@Entity()
@ObjectType()
export class Department extends BaseEntity{
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    _id: number

    @Column()
    @Field()
    name: string

    @Field(()=> [SubDepartment], {nullable: true})
    // @Column("jsonb", {array: true, nullable: true})
    @OneToMany( () => SubDepartment, subDepartment => subDepartment.department,{ cascade: ["insert"], nullable: true })
    // @OneToMany(()=>SubDepartment, subDepartment => subDepartment.department, {nullable: true})
    subDepartments: SubDepartment[]

    // // @Field(() => [SubDepartment], {nullable: true})
    // // @OneToMany("jsonb", () => SubDepartment, {nullable: true})
    // // subDepartments? : SubDepartment[]
}