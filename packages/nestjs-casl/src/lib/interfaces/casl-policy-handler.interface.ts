import { Abilities } from "@casl/ability";
import { CaslAbility } from "../types/casl-ability.type";

export interface ICaslPolicyHandler<T extends Abilities> {
    (ability: CaslAbility<T>): boolean | Promise<boolean>;
}
