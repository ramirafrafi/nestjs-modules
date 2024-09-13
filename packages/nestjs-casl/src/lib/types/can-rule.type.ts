import { Abilities, AbilityBuilder } from "@casl/ability";
import { CaslAbility } from "./casl-ability.type";

export type CanRule<T extends Abilities> = AbilityBuilder<CaslAbility<T>>['can'];
