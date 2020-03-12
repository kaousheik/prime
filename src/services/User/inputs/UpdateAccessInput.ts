import { InputType, Field, ID } from "type-graphql";
import { AccessLevel } from "../enums/AccessLevel";

// input UpdateAccessInput {
//     _id: ID!
//     accessLevel: String!
//     subDepartment: String
//   }

@InputType()
export class UpdateAccessInput {
    @Field(() => ID)
    _id: number

    @Field(() => AccessLevel)
    accessLevel: AccessLevel
}