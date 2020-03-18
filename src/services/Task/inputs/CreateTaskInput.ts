import { InputType, Field } from "type-graphql"

@InputType()
export class CreateTaskInput {
    @Field()
    brief: string

    @Field()
    details: string

    @Field()
    forDept: string

    @Field()
    deadline: string

    @Field()
    createdOn: string
}