/**
 * FilmMax Central Media & Playback Orchestrator (Netflix-Grade Architecture)
 * 
 * Responsibilities:
 * 1. Audio-Focus management: Prevents concurrent playback/audio leaks between
 *    Main Cinema Player, Reels Feed, Live TV, and Home Previews.
 * 2. Playback Lifecycle: Smooth pause/unload of background decoders to conserve memory.
 * 3. Cross-Media Session State: Tracks currently playing entity across app views.
 */

export type PlaybackDomain = "cinema" | "reels" | "live" | "preview" | "none";

type SessionListener = (activeDomain: PlaybackDomain) => void;

class MediaSessionOrchestrator {
  private activeDomain: PlaybackDomain = "none";
  private listeners: Set<SessionListener> = new Set();
  private activeEntityId: string | number | null = null;

  /**
   * Acquire exclusive playback focus for a specific domain.
   * Automatically notifies other domains to pause/mute.
   */
  public requestFocus(domain: PlaybackDomain, entityId?: string | number): boolean {
    if (this.activeDomain !== domain) {
      this.activeDomain = domain;
      this.activeEntityId = entityId || null;
      this.notifyListeners();
    }
    return true;
  }

  /**
   * Release playback focus when a player is stopped or unmounted.
   */
  public releaseFocus(domain: PlaybackDomain): void {
    if (this.activeDomain === domain) {
      this.activeDomain = "none";
      this.activeEntityId = null;
      this.notifyListeners();
    }
  }

  /**
   * Check if a specific domain currently holds exclusive playback focus.
   */
  public hasFocus(domain: PlaybackDomain): boolean {
    return this.activeDomain === domain;
  }

  public getActiveDomain(): PlaybackDomain {
    return this.activeDomain;
  }

  public getActiveEntityId(): string | number | null {
    return this.activeEntityId;
  }

  /**
   * Subscribe to playback focus transitions.
   */
  public subscribe(listener: SessionListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.activeDomain);
      } catch (e) {
        console.error("Playback session notification error", e);
      }
    });
  }
}

export const mediaOrchestrator = new MediaSessionOrchestrator();
