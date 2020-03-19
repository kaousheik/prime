import { Resolver, Query, Arg, Ctx, Mutation, ID } from "type-graphql";
import { Task } from "../entities/Task";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { CreateTaskInput } from "../inputs/CreateTaskInput";
import { AuthContext } from "../../User/types/AuthContext";
import { User } from "../../User/entities/User";
import { Department } from "../../Department/entities/Department";
import { Status } from "../enums/Status.enum";
// import { Status } from "../enums/Status.enum";

@Resolver()
export class TaskResolver {
    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Department) private readonly deptRepository: Repository<Department>
    ){}

    @Query(() => [Task], {nullable: true})
    async getTasks(){
        return await this.taskRepository.find({
            relations: ["forDept", "byDept", "createdBy", "assignedTo"]
        })
    }

    @Mutation(() => Task)
    async createTask(
        @Arg("data") data: CreateTaskInput,
        @Ctx() ctx: AuthContext
        ) {
            if(ctx.req.session!.userId){
                const authUser = await this.userRepository.findOne(ctx.req.session!.userId, {
                    relations: ["department"]
                })
                const {forDept, ...rest} = data
                const task = this.taskRepository.create({
                    ...rest,
                    forDept: await this.deptRepository.findOne({
                        where: {name: forDept}
                    }),
                    byDept: authUser?.department,
                    createdBy: authUser
                })
                await this.taskRepository.save(task)
                return task
            } else return null
        }

        @Mutation(() => Task, {nullable: true})
        async assignTask(
            @Arg("taskID", () => ID) taskID: number,
            @Arg("userIDs", () => [ID]) userIDs: [number],
            @Ctx() ctx: AuthContext,
        ) {
            if(ctx.req.session!.userId){
                const authUser = await this.userRepository.findOne(ctx.req.session!.userId)
                if(authUser?.accessLevel === "CORE"){
                    const users = await this.userRepository.findByIds(userIDs)
                    const task = await this.taskRepository.findOne(taskID)
                    if(task){
                        task.assignedTo = users
                        task.status = Status.ASSIGNED
                        await this.taskRepository.save(task)
                    }
                    console.log(users)
                    return task
                } else return null
            } else return null
        }

        @Mutation(() => String)
        async deleteTask(
            @Arg("_id", () => ID) _id: number,
            @Ctx() ctx: AuthContext
        ){
            if(ctx.req.session!.userId){
                const authUser = await this.userRepository.findOne(ctx.req.session!.userId)
                const task = await this.taskRepository.findOne(_id, {relations: ["createdBy"]})
                if(task && authUser){
                    await this.taskRepository.remove(task)
                    return "Successfully deleted"
                } else return "Task Not Found"
            } else return "Unauthorized!"
        }

        @Mutation(() => Task, {nullable: true})
        async updateTaskStatus(
            @Arg("_id", () => ID) _id: number,
            @Arg("status", () => Status) status: Status,
            @Ctx() ctx: AuthContext
        ){
            if(ctx.req.session!.userId){
                let task: any = {};
                const authUser = await this.userRepository.findOne(ctx.req.session!.userId)
                switch(status){
                    case "COMPLETED":
                        if (authUser?.accessLevel === "CORE") {
                            task = await this.taskRepository.update(_id, {
                                status
                            })
                        }
                        break;
                    case "IN_PROGRESS":
                        task = await this.taskRepository
                        .update(_id, {status})
                        break
                    case "SUBMITTED":
                        task = await this.taskRepository.update(_id, {status})
                        break
                }
                console.log(task)
                return await this.taskRepository.findOne({where: {_id}})
            } else return null
        }

        
}