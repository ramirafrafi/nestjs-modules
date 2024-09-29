
import { Abilities } from '@casl/ability';
import { SetMetadata } from '@nestjs/common';
import { CaslPolicy } from '../types/casl-policy.type';

export const CASL_POLICIES_KEY = 'casl_policies';

export const CaslPolicies = <T extends Abilities>(
  ...handlers: Array<CaslPolicy<T>>
) => {
  return SetMetadata(CASL_POLICIES_KEY, handlers);
}
