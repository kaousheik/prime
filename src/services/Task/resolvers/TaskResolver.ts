import { Resolver, Query, Arg, ID, Ctx, Mutation } from "type-graphql"
import { Task } from "../entities/Task";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { AuthContext } from "src/services/User/types/AuthContext";
import { CreateTaskInput } from "../inputs/CreateTaskInput";
import { Department } from "../../Department/entities/Department";
import { User } from "../../User/entities/User";
import moment from "moment"
import { Status } from "../enums/Status.enum";
// import { Status } from "../enums/Status.enum";

@Resolver()
export class TaskResolver {
    constructor(
        @InjectRepository(Department) private readonly deptRepository: Repository<Department>,
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(User) private readonly userRepository: Repository<User>
        // @InjectRepository(SubDepartment) private readonly subDeptRepository: Repository<SubDepartment>
        ) {}

    @Query(() => [Task], {nullable: true})
    async getTasks(
        // @Arg("isAssigned", () => Boolean) isAssigned: boolean,
        // @Arg("page", () => Int) page: number,
        // @Ctx() ctx: AuthContext
        ):Promise<Task[] | null>{
            // if(ctx.req.session!.userId){
            //     const authUser = await this.userRepository.findOne({where: {_id: ctx.req.session!.userId}})
            //     switch(authUser?.accessLevel){
            //         case "COCAS": 
            //             return this.tasks( { skip : page * 20, first : 20 } );
            //     }
            // }
            return await this.taskRepository.find({
                relations: ["byDept", "forDept", "createdBy"]
            })
    }

    @Query(() => Task, {nullable: true})
    async getTask(@Arg("_id", () => ID) _id: number, @Ctx() ctx: AuthContext):Promise<Task | undefined>{
        if(ctx.req.session!.userId){
            return await this.taskRepository.findOne({
                where: {_id}, 
                relations: ["createdBy"]
            })
        } else return undefined
    }

    @Mutation(() => Task)
    async createTask(@Arg("data") data: CreateTaskInput, @Ctx() ctx: AuthContext){
        if(ctx.req.session!.userId){
            const authUser = await this.userRepository.findOne(ctx.req.session!.userId, {
                relations: ["department"]
            })
            const forDept = await this.deptRepository.findOne({where: {name: data.forDept}})
            const taskCreated = this.taskRepository.create({
                ...data,
                forDept,
                byDept: await this.deptRepository.findOne(authUser?.department._id),
                createdBy: authUser,
                createdOn: moment(parseInt(data.createdOn, 10)).format(),
                deadline: moment(parseInt(data.deadline, 10)).format()
            })
            return await this.taskRepository.save(taskCreated)
        } else return null
    }

    @Mutation(() => Task)
    async assignTask(
        @Arg("taskID", () => ID) taskId: number,
        @Arg("userIDs", () => [ID]) userIds: [number],
        @Ctx() ctx: AuthContext
    ){
        const authUser = await this.userRepository.findOne(ctx.req.session!.userId)
        if(authUser?.accessLevel === "CORE"){
            const users = await this.userRepository.findByIds(userIds)
            console.log(...users)
            const task = await this.taskRepository.findOne(taskId,{
                relations: ["assignedTo"]
            })
            if(task){
                task.assignedTo = [...users]
                task.status = Status.ASSIGNED
                console.log(task)
                await this.taskRepository.save(task)
                return task
            } else return null
            
            
        } else return null
    }
}
