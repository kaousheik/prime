import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql";
import { PrimeFeedback } from "../entities/Feedback";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { AuthContext } from "../types/AuthContext";
import { User } from "../entities/User";

@Resolver()
export class PrimeFeedbackResolver {
    constructor(
        @InjectRepository(PrimeFeedback) private readonly fbkRepository: Repository<PrimeFeedback>,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ){}
    @Query(() => [PrimeFeedback], {nullable: true})
    async getPrimeFeedback(@Ctx() ctx: AuthContext): Promise<PrimeFeedback[] | null>{
        const authUser = await this.userRepository.findOne(ctx.req.session!.userId, {relations: ["department"]})
        console.log(authUser?.department.name)
        if(authUser?.department?.name === "WEBOPS"){
            return await this.fbkRepository.find({relations: ["by", "by.department"]})
        } else return null     
    }

    @Mutation(() => PrimeFeedback)
    async givePrimeFeedback(@Arg("text") text: string, @Ctx() ctx: AuthContext){
        if(!ctx.req.session!.userId){
            return null
        }
        console.log(text)
        const authUser = await this.userRepository.findOne(ctx.req.session!.userId)
        const fbk = this.fbkRepository.create({
            text,
            by: authUser
        })
        return await this.fbkRepository.save(fbk)
        
    }
}