
import type { Abilities } from '@casl/ability';
import type { Type } from '@nestjs/common';
import { ICaslPolicyClassHandler } from '../interfaces/casl-policy-class-handler.interface';
import { ICaslPolicyFunctionHandler } from '../interfaces/casl-policy-function-handler.interface';

export type CaslPolicyHandler<T extends Abilities> =
  | ICaslPolicyClassHandler<T>
  | Type<ICaslPolicyClassHandler<T>>
  | ICaslPolicyFunctionHandler<T>;
