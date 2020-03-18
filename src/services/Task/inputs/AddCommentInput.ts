import { InputType, Field, ID } from "type-graphql";

@InputType()
export class AddCommentInput {

    @Field()
    text: string
    
    @Field(() =>ID)
    task: number

    @Field()
    time: string
} 