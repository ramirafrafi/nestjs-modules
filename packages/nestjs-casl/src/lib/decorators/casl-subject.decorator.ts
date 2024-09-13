import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const PARAM_CASL_SUBJECTS = 'CASL_SUBJECTS';

export const CaslSubject = createParamDecorator(
  (data: number | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return (request?.[PARAM_CASL_SUBJECTS] ?? [])[data ?? 0];
  },
);
