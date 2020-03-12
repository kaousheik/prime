import { Entity, PrimaryGeneratedColumn, Column,  BaseEntity, ManyToOne, OneToMany } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Department } from "./Department";
import { User } from "../../User/entities/User";

@Entity()
@ObjectType()
export class SubDepartment extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    _id: number

    @Column()
    @Field()
    name: string

    @Field(() => Department, {nullable: true})
    @ManyToOne(() => Department, {nullable: true})
    department?: Department

    @Field(() => [User], {nullable: true})
    @OneToMany(() => User, user => user.subDepartment, {nullable: true, cascade: ["insert"]})
    members: User[]
}