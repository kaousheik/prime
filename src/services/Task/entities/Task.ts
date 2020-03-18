import { Entity, BaseEntity, PrimaryGeneratedColumn, Column,  OneToMany, ManyToOne } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Status } from "../enums/Status.enum";
import { TaskComment } from "./TaskComment";
import { Department } from "../../Department/entities/Department";
import { User } from "../../User/entities/User";

@Entity()
@ObjectType()
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    _id: number

    @Column()
    @Field()
    brief: string

    @Column()
    @Field()
    details: string

    @Field(() => Department, {nullable: true})
    @ManyToOne(() => Department, {nullable: true})
    forDept: Department

    @Field(() => Department, {nullable: true})
    @ManyToOne(() => Department, {nullable: true})
    byDept: Department

    @ManyToOne(() => User,  user => user.tasksCreated ,{nullable: true})
    @Field(() => User,{nullable: true})
    createdBy: User
    
    @Field(() => [User], {nullable: true})
    @OneToMany(() => User, user => user.tasksAssigned, {nullable: true, cascade: ["insert"]})
    assignedTo: User[]

    @Column({
        type: "enum",
        enum:   Status,
        default: Status.SUBMITTED
    })
    @Field(() => Status)
    status: Status

    @Column()
    @Field()
    deadline: string

    @Column()
    @Field()
    createdOn: string

    
    @Field(() => [TaskComment], {nullable: true})
    @OneToMany(() => TaskComment, taskComment => taskComment.task, {nullable: true, cascade: ["insert"]})
    comments: TaskComment[]
}