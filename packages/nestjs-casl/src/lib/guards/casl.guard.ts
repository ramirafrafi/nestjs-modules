import { Abilities, defineAbility, ExtractSubjectType, Normalize } from '@casl/ability';
import type { CanActivate, ExecutionContext, Type } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import {
  ContextIdFactory,
  ModuleRef,
  Reflector,
  REQUEST,
} from '@nestjs/core';
import { CASL_POLICIES_KEY } from '../decorators/casl-policies.decorator';
import { PARAM_CASL_SUBJECTS } from '../decorators/casl-subject.decorator';
import { CASL_ABILITY_FACTORY, ICaslAbilityFactory } from '../interfaces/casl-ability-factory.interface';
import { ICaslPolicyClass } from '../interfaces/casl-policy-class.interface';
import { ICaslPolicyHandler } from '../interfaces/casl-policy-handler.interface';
import { CaslAbility } from '../types/casl-ability.type';
import { CaslPolicy } from '../types/casl-policy.type';

@Injectable()
export class CaslGuard<T extends Abilities> implements CanActivate {
  constructor(
    @Inject(REQUEST)
    private request: Record<string, unknown>,
    @Inject(CASL_ABILITY_FACTORY)
    private caslAbilityFactory: ICaslAbilityFactory<T>,
    private reflector: Reflector,
    private moduleRef: ModuleRef,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers = this.reflector.getAllAndOverride<Array<CaslPolicy<T>>>(
      CASL_POLICIES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const ability = await defineAbility<CaslAbility<T>>(
      async (can, cannot) => this.caslAbilityFactory.defineAbility(can, cannot),
      {
        detectSubjectType: (subject) => {
          return subject.constructor as ExtractSubjectType<Normalize<T>[1]>;
        },
      },
    );

    if (!Array.isArray(policyHandlers) || policyHandlers.length === 0) {
      return true;
    }

    const handlersResponses = await Promise.all(
      policyHandlers.map(async (handler) =>
        this.execPolicyHandler(handler, ability),
      ),
    );

    return handlersResponses.every(Boolean);
  }

  private async execPolicyHandler(
    handler: CaslPolicy<T>,
    ability: CaslAbility<T>,
  ) {
    // The handler is a class implementing ICaslPolicyClassHandler
    if ((handler as Type).name) {
      // We resolve an instance for the current request
      const handlerInstance = await this.moduleRef.resolve(
        handler as Type<ICaslPolicyClass<T>>,
        ContextIdFactory.getByRequest(this.request),
        { strict: false },
      );

      return this.execObjectPolicyHandler(handlerInstance, ability);
    }

    // The handler is a function of the type ICaslPolicyFunctionHandler
    if (typeof handler === 'function') {
      return (handler as ICaslPolicyHandler<T>)(ability);
    }

    // The handler is an instance implementing ICaslPolicyClassHandler
    return this.execObjectPolicyHandler(handler, ability);
  }

  private async execObjectPolicyHandler(
    handler: ICaslPolicyClass<T>,
    ability: CaslAbility<T>,
  ) {
    const subject = await handler.resolveSubject?.();

    this.request[PARAM_CASL_SUBJECTS] = [
      ...((this.request[PARAM_CASL_SUBJECTS] as [] | undefined) ?? []),
      subject,
    ];

    return handler.handle(ability, subject);
  }
}
