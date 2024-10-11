
import { Abilities, CanParameters } from '@casl/ability';
import { CaslPolicies } from './casl-policies.decorator';
import { CaslAbility } from '../types/casl-ability.type';
import { ICaslPolicyHandler } from '../interfaces/casl-policy-handler.interface';
import { castArray } from 'lodash';

export const CaslPermissions = <T extends Abilities>(...permissions: Array<T>) => {
  return CaslPolicies(
    ...permissions.map(createPolicyHandler),
  );
}

function createPolicyHandler<T extends Abilities>(permission: T): ICaslPolicyHandler<T> {
  return (ability: CaslAbility<T>) => ability.can(
    ...castArray(permission) as unknown as CanParameters<T>,
  );
}
