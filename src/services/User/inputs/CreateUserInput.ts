import { InputType, Field } from "type-graphql";
import { User } from "../entities/User";
import { AccessLevel } from "../enums/AccessLevel";
// import { Department } from "src/services/Department/entities/Department";

@InputType()
export class CreateUserInput implements Partial<User> {
    
    @Field()
    name: string

    @Field()
    email: string

    @Field()
    password: string

    @Field(() => AccessLevel)
    accessLevel: AccessLevel

    @Field({nullable: true})
    mobile?: string

    @Field({nullable: true})
    upi?: string

    @Field({nullable: true})
    avatar: string

    @Field({nullable: true})
    dept: string

}