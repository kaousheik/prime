import { Resolver, Mutation, Query, Arg } from "type-graphql";
import { Department } from "../entities/Department";
import { SubDepartment } from "../entities/SubDepartment";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";

@Resolver()
export class DepartmentResolver {
    constructor(
        @InjectRepository(Department) private readonly deptRepository: Repository<Department>,
        @InjectRepository(SubDepartment) private readonly subDeptRepository: Repository<SubDepartment>
        ) {}
    @Query(() => [Department])
    async getDepartments(): Promise<Department[] | null> {
        return await this.deptRepository.find({relations: ["subDepartments", "members", "members.department", "members.department.subDepartments"]})
    }
    @Mutation(() => Department)
    async createDept(@Arg("name") name: string): Promise<Department>{

        const dept = this.deptRepository.create({
            name
        })
        return await this.deptRepository.save(dept)
    }

    @Mutation(() => SubDepartment)
    async createSub(@Arg("name") name: string, @Arg("dept") dept: string):Promise<SubDepartment | null> {
        const department = await this.deptRepository.findOne({
            where: {name: dept}, 
            relations: ["subDepartments"]
        }) 
        if(department){
            const subdept = this.subDeptRepository.create({
                name,
            })
            department.subDepartments.push(subdept)
            console.log(department)
            await this.deptRepository.save(department)
            await this.subDeptRepository.save(subdept)
            return subdept
        } else return null
    }


    @Query(() => [SubDepartment], {nullable: true})
    async getSub() {
        return await SubDepartment.find({relations: ["department", "members"]})
    }
}