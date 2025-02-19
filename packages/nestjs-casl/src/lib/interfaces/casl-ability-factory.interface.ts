import type { Abilities } from '@casl/ability';
import { InjectionToken } from '@nestjs/common';
import { CanRule } from '../types/can-rule.type';
import { CannotRule } from '../types/cannot-rule.type';

export const CASL_ABILITY_FACTORY: InjectionToken = Symbol('CASL_ABILITY_FACTORY');

export interface ICaslAbilityFactory<T extends Abilities> {
  /**
   * Defining rules goes here using can() and cannot().
   * For documentation about these functions, see @casl/ability official documentation:
   * https://casl.js.org/en/guide/intro
   *
   * @param {CanRule<T>} can
   * @param {CannotRule<T>} cannot
   */
  defineAbility(
    can: CanRule<T>,
    cannot: CannotRule<T>,
  ): void | Promise<void>;
}
