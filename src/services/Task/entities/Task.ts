import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Department } from "../../Department/entities/Department";
import { Status } from "../enums/Status.enum";
import { User } from "../../User/entities/User";

@Entity()
@ObjectType()
export class Task extends BaseEntity{
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    _ID: number

    @Field()
    @Column()
    brief: string

    @Field()
    @Column()
    details: string

    @Field(() => Department, {nullable: true})
    @ManyToOne(() => Department, department => department.tasksCreated, {nullable: true})
    forDept: Department

    @Field(() => Department, {nullable: true})
    @ManyToOne(() => Department, department => department.tasksAssigned, {nullable: true})
    byDept: Department

    @Field()
    @Column()
    deadline: string

    @Field(() => Status)
    @Column({
        type: "enum",
        enum: Status,
        default: Status.NOT_ASSIGNED
    })
    status: Status

    // @Field()
    // @Column({default})
    // createdOn: string 

    @Field(() => User, {nullable: true})
    @ManyToOne(() => User, user => user.tasksCreated, {nullable: true})
    createdBy: User 

    @Field(() => [User], {nullable: true})
    @ManyToMany(() => User, user => user.tasksAssigned, {nullable: true, cascade: ["insert"]})
    @JoinTable()
    assignedTo: User[]
}
