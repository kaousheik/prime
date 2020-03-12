import { InputType, Field } from "type-graphql";

@InputType()
export class UpdateUserInput {
    @Field({nullable: true})
    avatar: string

    @Field({nullable: true})
    mobile: string

    @Field({nullable: true})
    upi: string
}