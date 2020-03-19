import { Resolver, Query, Mutation, Arg, Ctx, ID } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../entities/User";
import { Repository } from "typeorm";
import { CreateUserInput } from "../inputs/CreateUserInput";
import bcrypt from "bcryptjs"
import { Department } from "../../Department/entities/Department";
import { LoginInput } from "../inputs/LoginInput";
import { AuthContext } from "../types/AuthContext"
import { UpdateAccessInput } from "../inputs/UpdateAccessInput";
import { AccessLevel } from "../enums/AccessLevel";
import { SubDepartment } from "../../Department/entities/SubDepartment";
import { UpdateUserInput } from "../inputs/UpdateUserInput";
@Resolver()
export class UserResolver {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Department) private readonly deptRepository: Repository<Department>,
        @InjectRepository(SubDepartment) private readonly subDeptRepository: Repository<SubDepartment>
    ){}
    @Query(() => [User])
    async getAllUsers() {
        return await this.userRepository.find({
                relations: [
                    "subDepartment",    
                    "department", 
                    "department.members", 
                    "department.subDepartments",
                    // "tasksCreated",
                    // "tasksAssigned"
                ]})
    }

    @Query(() => User, {nullable: true})
    async me(@Ctx() ctx: AuthContext):Promise<User | undefined> {
        if (!ctx.req.session!.userId) {
            return undefined;
          }
      
          return await this.userRepository.findOne(ctx.req.session!.userId, {
            relations: [
                "department", 
                "department.subDepartments", 
                "department.members", 
                "subDepartment"
                // "tasksCreated", 
                // "tasksCreated.assignedTo"
                // "tasksAssigned"
            ]
          });
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

    @Mutation(() => Boolean)
    async logout(@Ctx() ctx: AuthContext): Promise<Boolean> {
        return new Promise((res, rej) =>
          ctx.req.session!.destroy(err => {
            if (err) {
              console.log(err);
              return rej(false);
            }
    
            ctx.res.clearCookie("prime");
            return res(true);
          })
        );
      }

    @Mutation(() => String)
    async updateAccess(
        @Arg("data") data: UpdateAccessInput, 
        @Ctx() ctx: AuthContext
        ): Promise<String> {
        if(!ctx.req.session!.userId){
            return "UnAuthorized"
        }
        const authUser = await User.findOne(ctx.req.session!.userId, {
            relations: ["department", "department.subDepartments", "department.members"]
        })
        if(authUser && authUser.accessLevel === AccessLevel.CORE) {
            const updatedUser = await this.userRepository.update({_id: data._id}, data)
            if(updatedUser){
                return "Access Updated Successfully!"
            } else return "Unable to update Access!"
        } else return "Unauthorized Action"
    }

    @Mutation(() => String)
    async assignToSubDept(
        @Arg("_id", () => ID) _id: number,
        @Arg("subDept") subDept: string,
        @Ctx() ctx: AuthContext
        ):Promise<String>{
            if(!ctx.req.session!.userId){
                return "UnAuthorized"
            }
            console.log(ctx.req.session!.userId)
            const authUser = await User.findOne(ctx.req.session!.userId, {
                relations: ["department", "department.subDepartments", "department.members"]
            })
            if(authUser?.accessLevel === AccessLevel.CORE){
                const user = await this.userRepository.findOne({where: {_id}, relations: ["department"]})
                if(user){
                    if(user.department.name === authUser.department.name){
                        console.log(user.department.name)
                        console.log(authUser.department.name)
                        const subDepartment = await this.subDeptRepository.findOne({where: {name: subDept}, relations: ["members"]})
                        if(subDepartment){
                            user.subDepartment = subDepartment
                            subDepartment.members.push(user)
                            await this.subDeptRepository.save(subDepartment)
                            await this.userRepository.save(user)
                            return "User Added to Subdepartment"
                        } else return "SubDepartment Does Not Exists"
                    } else return "Unauthorized."
                } else return "User Not Found"
            } else return "Unauthorized Action"
    }

    @Mutation(() => String)
    async updateUserDetails(
        @Arg("data") data: UpdateUserInput,
        @Ctx() ctx: AuthContext
    ) {
        if(!ctx.req.session!.userId)
        return "Unauthorized"
        
        await this.userRepository.update(ctx.req.session!.userId, data)
        return "Updated SuccessFully"
    }

    @Mutation(() => User, {nullable: true})
    async updatePassword(
        @Arg("oldPassword") oldPassword: string,
        @Arg("newPassword") newPassword: string,
        @Ctx() ctx: AuthContext
    ): Promise<User | null>{
        if(!ctx.req.session!.userId)
        return null

        const authUser = await this.userRepository.findOne({where: {_id: ctx.req.session!.userId}})
        if(authUser && bcrypt.compareSync( oldPassword, authUser.password )){
            authUser.password = bcrypt.hashSync(newPassword, 10)
            return await this.userRepository.save(authUser)
        } else return null

    }
}