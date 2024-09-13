import type { Abilities, MongoQuery, PureAbility } from '@casl/ability';

export type CaslAbility<T extends Abilities> = PureAbility<T, MongoQuery>;
