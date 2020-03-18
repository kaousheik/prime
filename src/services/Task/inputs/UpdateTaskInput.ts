import { InputType, Field, ID } from "type-graphql"

@InputType()
export class UpdateTaskInput {
    @Field(() =>ID)
    _id: number

    @Field({nullable: true})
    details: string

    @Field({nullable: true})
    brief: string

    @Field({nullable: true})
    deadline: string

    @Field({nullable: true})
    status: string
}