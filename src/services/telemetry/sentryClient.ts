/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Sentry from '@sentry/browser';

/**
 * PII Scrubber Utility - Strips sensitive credentials, tokens, cards, and personal info
 */
export function scrubSensitiveData(text: string): string {
  if (!text || typeof text !== 'string') return text;
  return text
    // Strip emails
    .replace(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/gi, '[REDACTED_EMAIL]')
    // Strip JWT / session tokens
    .replace(/(Bearer\s+|session[_-]?token["']?\s*[:=]\s*["']?)[A-Za-z0-9-_=.]+/gi, '$1[REDACTED_TOKEN]')
    // Strip 16-digit credit card numbers
    .replace(/\b(?:\d{4}[ -]?){3}\d{4}\b/g, '[REDACTED_CARD]')
    // Strip password keys
    .replace(/(password["']?\s*[:=]\s*["']?)[^"',\s}]+/gi, '$1[REDACTED_PWD]');
}

class FilmMaxTelemetry {
  private isInitialized = false;
  private isSentryActive = false;
  private localErrorLog: Array<{ message: string; timestamp: number; level: string }> = [];

  public init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    const isBrowser = typeof window !== 'undefined';

    // Safely extract Sentry DSN across Node process and Vite browser context
    let dsn: string | undefined = undefined;
    try {
      if (typeof process !== 'undefined' && process.env) {
        dsn = process.env.VITE_SENTRY_DSN;
      }
      if (!dsn && typeof import.meta !== 'undefined' && (import.meta as any).env) {
        dsn = (import.meta as any).env.VITE_SENTRY_DSN;
      }
      if (!dsn && isBrowser) {
        dsn = (window as any).__FILMMAX_SENTRY_DSN__;
      }
    } catch {}

    if (dsn && typeof dsn === 'string' && dsn.startsWith('http') && isBrowser) {
      try {
        Sentry.init({
          dsn,
          environment: typeof process !== 'undefined' ? process.env.NODE_ENV : 'production',
          tracesSampleRate: 0.2, // 20% trace sampling
          beforeSend(event) {
            if (event.exception?.values) {
              event.exception.values.forEach(val => {
                if (val.value) val.value = scrubSensitiveData(val.value);
              });
            }
            if (event.breadcrumbs) {
              event.breadcrumbs.forEach(bc => {
                if (bc.message) bc.message = scrubSensitiveData(bc.message);
              });
            }
            if (event.request?.headers) {
              delete event.request.headers['Authorization'];
              delete event.request.headers['authorization'];
              delete event.request.headers['cookie'];
            }
            if (event.user) {
              delete event.user.ip_address;
              delete event.user.email;
            }
            return event;
          }
        });
        this.isSentryActive = true;
        console.info('[FilmMax Telemetry] Sentry error monitoring initialized with PII scrubbing active.');
      } catch (err: any) {
        console.warn('[FilmMax Telemetry] Sentry initialization skipped gracefully:', err?.message || err);
        this.isSentryActive = false;
      }
    } else {
      console.info('[FilmMax Telemetry] Running in graceful local observability mode (Node/local fallback active).');
    }

    if (isBrowser) {
      try {
        window.addEventListener('unhandledrejection', (event) => {
          this.captureException(event.reason || new Error('Unhandled Promise Rejection'));
        });
      } catch {}
    }
  }

  public captureException(error: Error | any, context?: Record<string, any>) {
    const errorMsg = scrubSensitiveData(error?.message || String(error));
    
    this.localErrorLog.unshift({
      message: errorMsg,
      timestamp: Date.now(),
      level: 'error'
    });
    if (this.localErrorLog.length > 50) this.localErrorLog.pop();

    if (this.isSentryActive) {
      try {
        Sentry.captureException(error, { extra: context });
      } catch {}
    }
  }

  public captureMessage(message: string, level: 'info' | 'warning' | 'error' | 'fatal' | 'debug' = 'info') {
    const cleanMsg = scrubSensitiveData(message);
    this.localErrorLog.unshift({
      message: cleanMsg,
      timestamp: Date.now(),
      level
    });
    if (this.localErrorLog.length > 50) this.localErrorLog.pop();

    if (this.isSentryActive) {
      try {
        Sentry.captureMessage(cleanMsg, level as any);
      } catch {}
    }
  }

  public addBreadcrumb(category: string, message: string, data?: Record<string, any>) {
    if (this.isSentryActive) {
      try {
        Sentry.addBreadcrumb({
          category,
          message: scrubSensitiveData(message),
          data,
          level: 'info'
        });
      } catch {}
    }
  }

  public getDiagnostics() {
    return {
      sentryActive: this.isSentryActive,
      errorsRecorded: this.localErrorLog.length,
      recentErrors: this.localErrorLog.slice(0, 5)
    };
  }
}

export const telemetry = new FilmMaxTelemetry();

