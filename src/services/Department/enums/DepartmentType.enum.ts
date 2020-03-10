import { registerEnumType } from "type-graphql";

export enum DepartmentType {
    WEBOPS,
    FINANCE,
    PUBLICITY,
    EVENTS,
    QMS,
    OANDIP,
    EVOLVE,
    ENVISAGE,
    SPONSORS,
    CONCEPTANDDESIGN,
}
registerEnumType(DepartmentType, {
    name: "DepartmentType"
})