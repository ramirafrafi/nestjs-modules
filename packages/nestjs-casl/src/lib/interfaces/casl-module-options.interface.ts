import { Abilities } from "@casl/ability";
import { ICaslAbilityFactory } from "./casl-ability-factory.interface";
import { DynamicModule, Type } from "@nestjs/common";

type BaseOptions = Pick<DynamicModule, 'global'>;

export interface ICaslModuleOptions<T extends Abilities> extends BaseOptions {
    abilityFactory: ICaslAbilityFactory<T> | Type<ICaslAbilityFactory<T>>;
}
