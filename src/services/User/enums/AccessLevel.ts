import { registerEnumType } from "type-graphql";

export enum AccessLevel {
    CORE,
    COORD,
    COCAS,
    COCAD,
    HEAD
}
registerEnumType(AccessLevel, {
    name: "AccessLevel"
})