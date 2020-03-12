import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../entities/User";
import { Repository } from "typeorm";
import { CreateUserInput } from "../inputs/CreateUserInput";
import bcrypt from "bcryptjs"
import { Department } from "../../Department/entities/Department";
@Resolver()
export class UserResolver {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Department) private readonly deptRepository: Repository<Department>,
    ){}
    @Query(() => [User])
    async getAllUsers() {
        return await this.userRepository.find({relations: ["department", "members", "subDepartments"]})
    }

    @Mutation(() => User)
    async createUser(
        @Arg("data") data: CreateUserInput
    ): Promise<User | undefined> {
        const {password, dept, ...rest} = data
        const hashedPwd = bcrypt.hashSync( password, 10 );
        const department = await this.deptRepository.findOne({
            where: {name: dept},
            relations: ["members"]
        })
        if(department){
            const user = this.userRepository.create({
                ...rest,
                password: hashedPwd,
                department
            })
            department.members.push(user)
            await this.deptRepository.save(department)
            await this.userRepository.save(user)
            return user

        } else {
            const user = this.userRepository.create({
                ...rest,
                password: hashedPwd
            })
            await this.userRepository.save(user)
            return user
        }
    }
}