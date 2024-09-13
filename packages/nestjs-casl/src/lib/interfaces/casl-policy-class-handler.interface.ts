import type { Abilities, InferSubjects } from '@casl/ability';
import { CaslAbility } from '../types/casl-ability.type';

export interface ICaslPolicyClassHandler<
  T extends Abilities,
  S extends InferSubjects<unknown> = InferSubjects<unknown>,
> {
  handle(ability: CaslAbility<T>, subject?: S): Promise<boolean>;

  resolveSubject?(): Promise<S | undefined>;
}
