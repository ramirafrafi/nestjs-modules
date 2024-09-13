
import { Abilities } from '@casl/ability';
import { SetMetadata } from '@nestjs/common';
import { CaslPolicyHandler } from '../types/casl-policy-handler.type';

export const CASL_POLICIES_KEY = 'casl_policies';

export const CaslPolicies = <T extends Abilities>(
  ...handlers: Array<CaslPolicyHandler<T>>
) => {
  return SetMetadata(CASL_POLICIES_KEY, handlers);
}
