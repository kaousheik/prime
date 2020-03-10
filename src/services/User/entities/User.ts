import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@Entity()
@ObjectType()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    _id: number

    @Field()
    @Column()
    name: string

    @Field()
    @Column("text", { unique: true })
    email: string

    @Field()
    @Column()
    password: string

    @Field({nullable: true})
    @Column({nullable: true})
    mobile?: string

    @Field({nullable: true})
    @Column({nullable: true})
    avatar?: string

    @Field({nullable: true})
    @Column({nullable: true})
    upi?:string
}