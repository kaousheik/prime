import { registerEnumType } from "type-graphql";

export enum AccessLevel {
    CORE = "CORE",
    COORD = "COORD",
    COCAS = "COCAS",
    COCAD = "COCAD",
    HEAD = "HEAD" 
}
registerEnumType(AccessLevel, {
    name: "AccessLevel"
})