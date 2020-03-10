import { Resolver, Mutation, Query, Arg } from "type-graphql";
import { Department } from "../entities/Department";
import { DepartmentType } from "../enums/DepartmentType.enum";

@Resolver()
export class DepartmentResolver {

    @Query(() => [Department])
    async getDepartments(): Promise<Department[] | null> {
        return Department.find()
    }
    @Mutation(() => Department)
    async createDept(@Arg("name", () => DepartmentType) name: DepartmentType): Promise<Department | String>{
        
        return await Department.create({
            name
        }).save()
    }
}