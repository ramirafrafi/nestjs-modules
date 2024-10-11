
import type { Abilities } from '@casl/ability';
import type { Type } from '@nestjs/common';
import { ICaslPolicyClass } from '../interfaces/casl-policy-class.interface';
import { ICaslPolicyHandler } from '../interfaces/casl-policy-handler.interface';

export type CaslPolicy<T extends Abilities> =
  | ICaslPolicyHandler<T>
  | ICaslPolicyClass<T>
  | Type<ICaslPolicyClass<T>>;
