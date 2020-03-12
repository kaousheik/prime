import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../entities/User";
import { Repository } from "typeorm";
import { CreateUserInput } from "../inputs/CreateUserInput";
import bcrypt from "bcryptjs"
import { Department } from "../../Department/entities/Department";
import { LoginInput } from "../inputs/LoginInput";
import { AuthContext } from "../types/AuthContext"
@Resolver()
export class UserResolver {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Department) private readonly deptRepository: Repository<Department>,
    ){}
    @Query(() => [User])
    async getAllUsers() {
        return await this.userRepository.find({
                relations: [
                    "department", 
                    "department.members", 
                    "department.subDepartments"
                ]})
    }

    @Query(() => User, {nullable: true})
    async me(@Ctx() ctx: AuthContext):Promise<User | null> {
        const authUser = await User.findOne(ctx.req.session!.userId, {
            relations: ["department", "department.subDepartments", "department.members"]
        })
        if(authUser) return authUser
        else return null
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

    @Mutation(() => User, {nullable: true})
    async login(
        @Arg("data") data: LoginInput,
        @Ctx() ctx: AuthContext
        ): Promise<User | null>{
        const {email, password} = data
        const user = await this.userRepository.findOne({where: {email}})
        if(user){
            const isPasswordMatch = bcrypt.compareSync(password, user.password)
            if(isPasswordMatch){
                ctx.req.session!.userId = user._id
                return user
            } else return null
        } else return null
    }
}