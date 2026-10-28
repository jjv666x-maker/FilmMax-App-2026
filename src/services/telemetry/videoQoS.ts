/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { telemetry } from './sentryClient';

const getNow = (): number => (typeof performance !== 'undefined' ? performance.now() : Date.now());

export interface VideoQoSMetrics {
  movieId: string;
  movieTitle: string;
  sourceType: 'hls' | 'mp4' | 'youtube';
  timeToFirstFrameMs: number | null;
  startupLatencyMs: number | null;
  stallCount: number;
  totalStallDurationMs: number;
  totalPlayTimeSec: number;
  rebufferRatioPercent: number;
  currentResolution: string;
  currentBitrateKbps: number;
  playbackErrors: number;
  lastError: string | null;
}

class VideoQoSTracker {
  private activeSession: {
    movieId: string;
    movieTitle: string;
    sourceType: 'hls' | 'mp4' | 'youtube';
    loadStartTime: number;
    playRequestTime: number | null;
    firstFrameRenderedTime: number | null;
    stallStartTime: number | null;
    stallCount: number;
    totalStallDurationMs: number;
    totalPlayTimeSec: number;
    currentResolution: string;
    currentBitrateKbps: number;
    playbackErrors: number;
    lastError: string | null;
  } | null = null;

  public startSession(movieId: string, movieTitle: string, sourceType: 'hls' | 'mp4' | 'youtube') {
    const now = getNow();
    this.activeSession = {
      movieId,
      movieTitle,
      sourceType,
      loadStartTime: now,
      playRequestTime: now,
      firstFrameRenderedTime: null,
      stallStartTime: null,
      stallCount: 0,
      totalStallDurationMs: 0,
      totalPlayTimeSec: 0,
      currentResolution: 'Auto (ABR)',
      currentBitrateKbps: 4500,
      playbackErrors: 0,
      lastError: null
    };

    telemetry.addBreadcrumb('video_qos', `Started playback session for: ${movieTitle} (${sourceType})`);
  }

  public onFirstFrameRendered() {
    if (!this.activeSession || this.activeSession.firstFrameRenderedTime !== null) return;
    const now = getNow();
    this.activeSession.firstFrameRenderedTime = now;
    const ttff = Math.round(now - (this.activeSession.playRequestTime || this.activeSession.loadStartTime));

    telemetry.addBreadcrumb('video_qos', `Time to First Frame (TTFF): ${ttff}ms`);
  }

  public onBufferingStart() {
    if (!this.activeSession) return;
    this.activeSession.stallStartTime = getNow();
    this.activeSession.stallCount += 1;
    telemetry.addBreadcrumb('video_qos', `Buffering stall #${this.activeSession.stallCount} started`);
  }

  public onBufferingEnd() {
    if (!this.activeSession || this.activeSession.stallStartTime === null) return;
    const stallDuration = getNow() - this.activeSession.stallStartTime;
    this.activeSession.totalStallDurationMs += stallDuration;
    this.activeSession.stallStartTime = null;
  }

  public onQualitySwitch(resolution: string, bitrateKbps: number) {
    if (!this.activeSession) return;
    this.activeSession.currentResolution = resolution;
    this.activeSession.currentBitrateKbps = bitrateKbps;
    telemetry.addBreadcrumb('video_qos', `ABR Ladder Switch: ${resolution} @ ${bitrateKbps}kbps`);
  }

  public onPlaybackProgress(currentTimeSec: number) {
    if (!this.activeSession) return;
    this.activeSession.totalPlayTimeSec = Math.max(this.activeSession.totalPlayTimeSec, Math.floor(currentTimeSec));
  }

  public onPlaybackError(errorMsg: string) {
    if (!this.activeSession) return;
    this.activeSession.playbackErrors += 1;
    this.activeSession.lastError = errorMsg;

    telemetry.captureException(new Error(`[Video Playback Error] ${this.activeSession.movieTitle}: ${errorMsg}`), {
      movieId: this.activeSession.movieId,
      sourceType: this.activeSession.sourceType,
      stallCount: this.activeSession.stallCount
    });
  }

  public getSnapshot(): VideoQoSMetrics | null {
    if (!this.activeSession) return null;
    const ttff = this.activeSession.firstFrameRenderedTime && this.activeSession.playRequestTime
      ? Math.round(this.activeSession.firstFrameRenderedTime - this.activeSession.playRequestTime)
      : null;
    const startupLatency = this.activeSession.firstFrameRenderedTime
      ? Math.round(this.activeSession.firstFrameRenderedTime - this.activeSession.loadStartTime)
      : null;

    const playDurationMs = (this.activeSession.totalPlayTimeSec * 1000) || 1;
    const rebufferRatio = Math.min(100, Number(((this.activeSession.totalStallDurationMs / playDurationMs) * 100).toFixed(2)));

    return {
      movieId: this.activeSession.movieId,
      movieTitle: this.activeSession.movieTitle,
      sourceType: this.activeSession.sourceType,
      timeToFirstFrameMs: ttff,
      startupLatencyMs: startupLatency,
      stallCount: this.activeSession.stallCount,
      totalStallDurationMs: Math.round(this.activeSession.totalStallDurationMs),
      totalPlayTimeSec: this.activeSession.totalPlayTimeSec,
      rebufferRatioPercent: rebufferRatio,
      currentResolution: this.activeSession.currentResolution,
      currentBitrateKbps: this.activeSession.currentBitrateKbps,
      playbackErrors: this.activeSession.playbackErrors,
      lastError: this.activeSession.lastError
    };
  }

  public endSession() {
    this.activeSession = null;
  }
}

export const videoQoS = new VideoQoSTracker();
