import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ObjectType, ID, Field } from "type-graphql";
import { SubDepartment } from "./SubDepartment";
import { User } from "../../User/entities/User";
import { Task } from "../../Task/entities/Task";
// import { Task } from "../../Task/entities/Task";
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
    @OneToMany( () => SubDepartment, subDepartment => subDepartment.department,{ cascade: ["insert"], nullable: true })
    subDepartments: SubDepartment[]

    @Field(() => [User], {nullable: true})
    @OneToMany(() => User, user => user.department, {nullable: true, cascade: ["insert"]})
    members: User[]

    @Field(() => [Task], {nullable: true})
    @OneToMany(() => Task, task => task.forDept, {nullable: true, cascade: ["insert"]})
    tasksAssigned: Task[]

    @Field(() => [Task], {nullable: true})
    @OneToMany(() => Task, task => task.byDept, {nullable: true, cascade: ["insert"]})
    tasksCreated: Task[]
}