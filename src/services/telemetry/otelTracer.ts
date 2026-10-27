/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * OpenTelemetry Tracing Adapter for FilmMax
 * Conforms to W3C TraceContext standards (traceparent)
 * Supports spans for HTTP endpoints, DB queries, and media ingestion jobs.
 */

export interface Span {
  traceId: string;
  spanId: string;
  name: string;
  kind: 'SERVER' | 'CLIENT' | 'INTERNAL';
  startTimeMs: number;
  endTimeMs?: number;
  durationMs?: number;
  attributes: Record<string, string | number | boolean>;
  status: 'OK' | 'ERROR';
  errorMessage?: string;
}

class OpenTelemetryAdapter {
  private isEnabled = true;
  private otlpEndpoint: string | null = null;
  private recentSpans: Span[] = [];

  constructor() {
    this.otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || null;
    if (this.otlpEndpoint) {
      console.info(`[OpenTelemetry] Configured OTLP export destination: ${this.otlpEndpoint}`);
    } else {
      console.info('[OpenTelemetry] Running in local in-memory trace buffer mode (ready for OTel collector).');
    }
  }

  private generateId(length: number): string {
    let result = '';
    const hex = '0123456789abcdef';
    for (let i = 0; i < length; i++) {
      result += hex[Math.floor(Math.random() * 16)];
    }
    return result;
  }

  public startSpan(name: string, kind: 'SERVER' | 'CLIENT' | 'INTERNAL' = 'INTERNAL', attributes: Record<string, any> = {}): {
    span: Span;
    end: (status?: 'OK' | 'ERROR', errorMsg?: string) => void;
    traceparent: string;
  } {
    const traceId = this.generateId(32);
    const spanId = this.generateId(16);
    const span: Span = {
      traceId,
      spanId,
      name,
      kind,
      startTimeMs: Date.now(),
      attributes: {
        'service.name': 'filmmax-backend',
        'telemetry.sdk.language': 'typescript',
        ...attributes
      },
      status: 'OK'
    };

    const traceparent = `00-${traceId}-${spanId}-01`;

    const end = (status: 'OK' | 'ERROR' = 'OK', errorMsg?: string) => {
      span.endTimeMs = Date.now();
      span.durationMs = span.endTimeMs - span.startTimeMs;
      span.status = status;
      if (errorMsg) span.errorMessage = errorMsg;

      this.recordSpan(span);
    };

    return { span, end, traceparent };
  }

  private recordSpan(span: Span) {
    this.recentSpans.unshift(span);
    if (this.recentSpans.length > 100) {
      this.recentSpans.pop();
    }

    // Optional remote export to collector if configured
    if (this.otlpEndpoint) {
      this.exportToCollector(span);
    }
  }

  private async exportToCollector(span: Span) {
    try {
      if (!this.otlpEndpoint) return;
      // Non-blocking fire-and-forget payload matching OpenTelemetry OTLP JSON spec
      fetch(`${this.otlpEndpoint}/v1/traces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceSpans: [{
            resource: {
              attributes: [{ key: 'service.name', value: { stringValue: 'filmmax-cinema' } }]
            },
            scopeSpans: [{
              spans: [{
                traceId: span.traceId,
                spanId: span.spanId,
                name: span.name,
                kind: span.kind === 'SERVER' ? 2 : 1,
                startTimeUnixNano: span.startTimeMs * 1000000,
                endTimeUnixNano: (span.endTimeMs || span.startTimeMs) * 1000000,
                attributes: Object.entries(span.attributes).map(([key, value]) => ({
                  key,
                  value: typeof value === 'number' ? { intValue: value } : { stringValue: String(value) }
                })),
                status: { code: span.status === 'OK' ? 1 : 2 }
              }]
            }]
          }]
        })
      }).catch(() => {});
    } catch {}
  }

  public getTraceSnapshot() {
    return {
      collectorConnected: !!this.otlpEndpoint,
      totalSpansRecorded: this.recentSpans.length,
      recentSpans: this.recentSpans.slice(0, 10)
    };
  }
}

export const otelTracer = new OpenTelemetryAdapter();
