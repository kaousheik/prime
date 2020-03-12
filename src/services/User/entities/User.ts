import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { AccessLevel } from "../enums/AccessLevel";
import { Department } from "../../Department/entities/Department";

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

    @Column()
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

}