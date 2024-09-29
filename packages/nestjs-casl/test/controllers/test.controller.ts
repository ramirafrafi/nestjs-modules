import { Controller, Get, UseGuards } from "@nestjs/common";
import { CaslPoliciesGuard } from "../../src/lib/guards/casl-policies.guard";
import { CaslPolicies } from "../../src/lib/decorators/casl-policies.decorator";
import { TestAction } from "../ability/test.action";
import { CaslPermissions } from "../../src/lib/decorators/casl-permissions.decorator";

@Controller()
export class TestController {
    @UseGuards(CaslPoliciesGuard)
    @CaslPolicies((ability) => ability.can(TestAction.Allow))
    @Get('casl-policies/allow')
    allowPolicy() {
        return {
            success: true,
            message: 'OK',
        };
    }

    @UseGuards(CaslPoliciesGuard)
    @CaslPolicies((ability) => ability.can(TestAction.Deny))
    @Get('casl-policies/deny')
    denyPolicy() {
        return {
            success: true,
            message: 'OK',
        };
    }

    @UseGuards(CaslPoliciesGuard)
    @CaslPermissions(TestAction.Allow)
    @Get('casl-permissions/allow')
    allowPermission() {
        return {
            success: true,
            message: 'OK',
        };
    }

    @UseGuards(CaslPoliciesGuard)
    @CaslPermissions(TestAction.Deny)
    @Get('casl-permissions/deny')
    denyPermission() {
        return {
            success: true,
            message: 'OK',
        };
    }

    @UseGuards(CaslPoliciesGuard)
    @CaslPermissions(TestAction.Allow, TestAction.Deny)
    @Get('casl-permissions/multi/deny')
    denyMultiPermissions() {
        return {
            success: true,
            message: 'OK',
        };
    }
}
