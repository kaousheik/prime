import { ObjectType, Field, ID } from "type-graphql";
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Task } from "./Task";

@ObjectType()
@Entity()
export class TaskComment extends BaseEntity{

    @PrimaryGeneratedColumn()
    @Field(()=>ID)
    _id: number

    @Field()
    @Column()
    text: string

    @Field()
    @Column()
    creatorName: string

    @Field()
    @Column()
    creatorAvatar: string

    @Field()
    @Column()
    creatorAccessLevel: string

    @Field()
    @Column()
    time: string

    @ManyToOne(() => Task, task => task.comments)
    task: Task
}