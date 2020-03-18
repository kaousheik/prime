import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { AccessLevel } from "../enums/AccessLevel";
import { Department } from "../../Department/entities/Department";
import { SubDepartment } from "../../Department/entities/SubDepartment";
import { Task } from "../../Task/entities/Task";
// import { TaskComment } from "../../Task/entities/TaskComment";

@Entity()
@ObjectType()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    @Field(() =>ID)
    _id: number

    @Column()
    @Field()
    name: string

    @Column("text", {unique: true})
    @Field()
    email: string

    @Column()
    @Field()
    password: string

    @Column({
        type: "enum",
        enum: AccessLevel,
        default: AccessLevel.COORD
    })
    @Field(() => AccessLevel)
    accessLevel: AccessLevel

    @Column({nullable: true})
    @Field({nullable: true})
    upi?: string

    @Column({nullable: true})
    @Field({nullable: true})
    mobile?: string

    @Column({nullable: true})
    @Field({nullable: true})
    avatar?: string

    @Field(()=> Department, {nullable: true})
    @ManyToOne(() => Department, department => department.members, {nullable: true})
    department: Department

    @Field(() => SubDepartment, {nullable: true})
    @ManyToOne(() => SubDepartment, subDepartment => subDepartment.members, {nullable: true})
    subDepartment: SubDepartment

    @Field(() => [Task], {nullable: true})
    @OneToMany(() => Task, task => task.createdBy, {nullable: true, cascade: ["insert"]})
    tasksCreated: Task[]

    @Field(() => [Task], {nullable: true})
    @OneToMany(() => Task, task => task.assignedTo, {nullable: true, cascade: ["insert"]})
    tasksAssigned: Task[]

    // @Field(() => [TaskComment], {nullable: true})
    // @OneToMany(() => TaskComment, taskComment => taskComment.creatorName)
    // taskComments: TaskComment[]
}