import { Abilities, AbilityBuilder } from "@casl/ability";
import { CaslAbility } from "./casl-ability.type";

export type CannotRule<T extends Abilities> = AbilityBuilder<CaslAbility<T>>['cannot'];
