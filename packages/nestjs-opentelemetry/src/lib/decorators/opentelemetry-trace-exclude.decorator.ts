import { SetMetadata } from '@nestjs/common';

export const OTEL_TRACE_EXCLUDE = 'otel_trace_exclude';

export const OpentelemetryTraceExclude = () => SetMetadata(OTEL_TRACE_EXCLUDE, true);
