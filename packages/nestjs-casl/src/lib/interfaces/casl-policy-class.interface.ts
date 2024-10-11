import type { Abilities, InferSubjects } from '@casl/ability';
import { CaslAbility } from '../types/casl-ability.type';

export interface ICaslPolicyClass<
  T extends Abilities,
  S extends InferSubjects<unknown> = InferSubjects<unknown>,
  R = unknown,
> {
  handle(ability: CaslAbility<T>, subject?: S): Promise<boolean>;

  resolveSubject?(): Promise<R | undefined>;
}
