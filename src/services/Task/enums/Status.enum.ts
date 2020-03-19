import { registerEnumType } from "type-graphql";

export enum Status {
    ASSIGNED = "ASSIGNED",
    NOT_ASSIGNED = "NOT_ASSIGNED",
    COMPLETED = "COMPLETED",
    IN_PROGRESS = "IN_PROGRESS",
    SUBMITTED = "SUBMITTED"
}

registerEnumType(Status, {
    name: "Statua"
})