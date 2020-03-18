import { registerEnumType } from "type-graphql";

export enum Status {
		NOT_ASSIGNED = "NOT_ASSIGNED",
		ASSIGNED = "ASSIGNED",
        IN_PROGRESS = "IN_PROGRESS",
		SUBMITTED = "SUBMITTED",
		COMPLETED = "COMPLETED"
} 
registerEnumType(Status, {
    name: "Status"
})