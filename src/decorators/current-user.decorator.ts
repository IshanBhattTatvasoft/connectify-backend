import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserDetails } from "src/helper/interface";

export const CurrentUser = createParamDecorator((data: keyof any, ctx: ExecutionContext) => {
    const {user} = ctx.switchToHttp().getRequest();
    return user as UserDetails;
})