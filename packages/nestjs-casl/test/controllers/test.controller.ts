import { Controller, Get, UseGuards } from "@nestjs/common";
import { CaslPoliciesGuard } from "../../src/lib/guards/casl-policies.guard";
import { CaslPolicies } from "../../src/lib/decorators/casl-policies.decorator";
import { TestAction } from "../ability/test.action";

@Controller()
export class TestController {
    @UseGuards(CaslPoliciesGuard)
    @CaslPolicies((ability) => ability.can(TestAction.Allow))
    @Get('allow')
    allow() {
        return {
            success: true,
            message: 'OK',
        };
    }

    @UseGuards(CaslPoliciesGuard)
    @CaslPolicies((ability) => ability.can(TestAction.Deny))
    @Get('deny')
    deny() {
        return {
            success: true,
            message: 'OK',
        };
    }
}
