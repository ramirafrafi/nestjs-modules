import { Type } from '@nestjs/common';
import type { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { OTEL_TRACE_EXCLUDE } from '../decorators/opentelemetry-trace-exclude.decorator';

export class TraceInjectorUtils {
  static isRepository(provider: InstanceWrapper): boolean {
    return this.providerPrototype(provider).name.endsWith('Repository');
  }

  static isService(provider: InstanceWrapper): boolean {
    return this.providerPrototype(provider).name.endsWith('Service');
  }

  static isExcluded(prototype: Record<string, unknown>): boolean {
    return Reflect.getMetadata(OTEL_TRACE_EXCLUDE, prototype) === true;
  }

  static providerPrototype(provider: InstanceWrapper): Type {
    return provider.metatype.prototype;
  }
}
