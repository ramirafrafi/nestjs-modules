import { ICaslAbilityFactory } from '../../src/lib/interfaces/casl-ability-factory.interface';
import { CanRule } from '../../src/lib/types/can-rule.type';
import { CannotRule } from '../../src/lib/types/cannot-rule.type';
import { TestAction } from './test.action';

export class TestAbilityFactory implements ICaslAbilityFactory<TestAction> {
    defineAbility(can: CanRule<TestAction>, cannot: CannotRule<TestAction>): void | Promise<void> {
        can(TestAction.Allow);
        cannot(TestAction.Deny);
    }
}
