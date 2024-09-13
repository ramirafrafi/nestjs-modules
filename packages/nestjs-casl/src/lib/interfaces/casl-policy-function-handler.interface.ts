import { Abilities } from "@casl/ability";
import { CaslAbility } from "../types/casl-ability.type";

export interface ICaslPolicyFunctionHandler<T extends Abilities> {
    (ability: CaslAbility<T>): boolean | Promise<boolean>;
}
