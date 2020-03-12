import { Entity, 
    ManyToOne, 
    PrimaryColumn } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { User } from "./User";

@Entity()
@ObjectType()
export class PrimeFeedback {

    @Field()
    @PrimaryColumn()
    text: string

    @Field(() => User, {nullable: true})
    @ManyToOne(() => User,{ cascade: true, nullable: true} )
    by?: User
}