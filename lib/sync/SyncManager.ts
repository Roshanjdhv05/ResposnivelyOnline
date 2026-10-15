import type {
  ClickPayload,
  ChangePayload,
  InputPayload,
  KeyPayload,
  ModalChangePayload,
  NavigatePayload,
  ScrollPayload,
  SyncChildMessage,
  SyncMode,
  SyncNotification,
  SyncParentMessage,
  TabChangePayload,
} from "./types";

export interface SyncManagerOptions {
  sessionId?: string;
  defaultMode?: SyncMode;
  onNavigateUrl?: (newUrl: string, isSpa?: boolean) => void;
  onNotification?: (notification: SyncNotification) => void;
  getDeviceName?: (uid: string) => string;
}

export interface FrameRegistration {
  uid: string;
  iframe: HTMLIFrameElement;
  abortController: AbortController | null;
  bridgeReady: boolean;
}

/**
 * Controller for viewport-normalized vertical and horizontal scroll synchronization.
 */
export class ScrollSyncController {
  private manager: SyncManager;

  constructor(manager: SyncManager) {
    this.manager = manager;
  }

  public handleScroll(driverUid: string, payload: ScrollPayload) {
    if (this.manager.getMode() === "disabled") return;
    this.manager.setSuppression(driverUid);

    const message: SyncParentMessage = {
      source: "rwp-parent",
      sessionId: this.manager.getSessionId(),
      type: "SCROLL",
      driverUid,
      data: payload,
      timestamp: Date.now(),
    };

    this.manager.broadcast(message, driverUid);

    // Direct DOM fallback for accessible same-origin iframes
    for (const [uid, reg] of this.manager.getRegisteredFrames()) {
      if (uid === driverUid || this.manager.isExcluded(uid)) continue;
      try {
        const win = reg.iframe.contentWindow;
        const doc = reg.iframe.contentDocument;
        if (win && doc) {
          const docEl = doc.documentElement;
          const body = doc.body;
          const scrollH = Math.max(docEl ? docEl.scrollHeight : 0, body ? body.scrollHeight : 0);
          const scrollW = Math.max(docEl ? docEl.scrollWidth : 0, body ? body.scrollWidth : 0);
          const clientH = win.innerHeight || (docEl ? docEl.clientHeight : 0);
          const clientW = win.innerWidth || (docEl ? docEl.clientWidth : 0);

          const maxScrollY = Math.max(0, scrollH - clientH);
          const maxScrollX = Math.max(0, scrollW - clientW);

          win.scrollTo({
            top: Math.round(payload.percentY * maxScrollY),
            left: Math.round((payload.percentX ?? 0) * maxScrollX),
            behavior: "instant",
          });
        }
      } catch {
        // Cross-origin: postMessage handles it
      }
    }
  }

  public scrollAllBy(driverUid: string, deltaX: number, deltaY: number) {
    if (this.manager.getMode() === "disabled") return;
    this.manager.setSuppression(driverUid);

    for (const [uid, reg] of this.manager.getRegisteredFrames()) {
      if (this.manager.isExcluded(uid)) continue;
      try {
        reg.iframe.contentWindow?.postMessage(
          {
            source: "rwp-parent",
            sessionId: this.manager.getSessionId(),
            type: "SCROLL_BY",
            deltaX,
            deltaY,
          },
          "*",
        );
      } catch {}

      try {
        reg.iframe.contentWindow?.scrollBy({ left: deltaX, top: deltaY, behavior: "instant" });
      } catch {}
    }
  }

  public resetScroll() {
    for (const [uid, reg] of this.manager.getRegisteredFrames()) {
      if (this.manager.isExcluded(uid)) continue;
      try {
        reg.iframe.contentWindow?.postMessage(
          {
            source: "rwp-parent",
            sessionId: this.manager.getSessionId(),
            type: "SCROLL",
            data: { percentY: 0, percentX: 0, scrollY: 0, scrollX: 0 },
          },
          "*",
        );
      } catch {}

      try {
        reg.iframe.contentWindow?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      } catch {}
    }
  }
}

/**
 * Controller for cross-device click mapping, keyboard events, and semantic interactions.
 */
export class InteractionSyncController {
  private manager: SyncManager;

  constructor(manager: SyncManager) {
    this.manager = manager;
  }

  public handleClick(driverUid: string, payload: ClickPayload) {
    if (this.manager.getMode() !== "all") return;
    this.manager.setSuppression(driverUid);

    const message: SyncParentMessage = {
      source: "rwp-parent",
      sessionId: this.manager.getSessionId(),
      type: "CLICK",
      driverUid,
      data: payload,
      timestamp: Date.now(),
    };

    this.manager.broadcast(message, driverUid);
  }

  public handleKeyDown(driverUid: string, payload: KeyPayload) {
    if (this.manager.getMode() !== "all") return;
    this.manager.setSuppression(driverUid);

    const message: SyncParentMessage = {
      source: "rwp-parent",
      sessionId: this.manager.getSessionId(),
      type: "KEY_DOWN",
      driverUid,
      data: payload,
      timestamp: Date.now(),
    };

    this.manager.broadcast(message, driverUid);
  }

  public handleMatchFailed(driverUid: string, reason: string) {
    const deviceName = this.manager.getDeviceName(driverUid);
    this.manager.notify({
      id: `match-fail-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      deviceUid: driverUid,
      deviceName,
      message: `${deviceName}: ${reason}`,
      type: "info",
      timestamp: Date.now(),
    });
  }
}

/**
 * Controller for form synchronization (inputs, dropdowns, checkboxes, textareas).
 */
export class FormSyncController {
  private manager: SyncManager;

  constructor(manager: SyncManager) {
    this.manager = manager;
  }

  public handleInput(driverUid: string, payload: InputPayload) {
    if (this.manager.getMode() !== "all") return;
    this.manager.setSuppression(driverUid);

    const message: SyncParentMessage = {
      source: "rwp-parent",
      sessionId: this.manager.getSessionId(),
      type: "INPUT",
      driverUid,
      data: payload,
      timestamp: Date.now(),
    };

    this.manager.broadcast(message, driverUid);
  }

  public handleChange(driverUid: string, payload: ChangePayload) {
    if (this.manager.getMode() !== "all") return;
    this.manager.setSuppression(driverUid);

    const message: SyncParentMessage = {
      source: "rwp-parent",
      sessionId: this.manager.getSessionId(),
      type: "CHANGE",
      driverUid,
      data: payload,
      timestamp: Date.now(),
    };

    this.manager.broadcast(message, driverUid);
  }

  public handleTabChange(driverUid: string, payload: TabChangePayload) {
    if (this.manager.getMode() !== "all") return;
    this.manager.setSuppression(driverUid);

    const message: SyncParentMessage = {
      source: "rwp-parent",
      sessionId: this.manager.getSessionId(),
      type: "TAB_CHANGE",
      driverUid,
      data: payload,
      timestamp: Date.now(),
    };

    this.manager.broadcast(message, driverUid);
  }

  public handleModalChange(driverUid: string, payload: ModalChangePayload) {
    if (this.manager.getMode() !== "all") return;
    this.manager.setSuppression(driverUid);

    const message: SyncParentMessage = {
      source: "rwp-parent",
      sessionId: this.manager.getSessionId(),
      type: "MODAL_CHANGE",
      driverUid,
      data: payload,
      timestamp: Date.now(),
    };

    this.manager.broadcast(message, driverUid);
  }
}

/**
 * Controller for internal SPA page navigation and link navigation.
 */
export class NavigationSyncController {
  private manager: SyncManager;

  constructor(manager: SyncManager) {
    this.manager = manager;
  }

  public handleNavigate(driverUid: string, payload: NavigatePayload) {
    if (this.manager.getMode() !== "all") return;
    this.manager.setSuppression(driverUid);

    const message: SyncParentMessage = {
      source: "rwp-parent",
      sessionId: this.manager.getSessionId(),
      type: "NAVIGATE",
      driverUid,
      data: payload,
      timestamp: Date.now(),
    };

    this.manager.broadcast(message, driverUid);

    // If navigation occurred and parent navigation handler exists
    if (payload.url && this.manager.onNavigateUrl) {
      this.manager.onNavigateUrl(payload.url, payload.isSpa);
    }
  }
}

/**
 * Centralized Synchronization Manager.
 * Coordinates all active device previews, managing scroll, clicks, forms, tabs,
 * and page navigation with exclusion controls and loop prevention.
 */
export class SyncManager {
  private mode: SyncMode;
  private sessionId: string;
  private excludedUids: Set<string>;
  private frames: Map<string, FrameRegistration>;
  private suppressUid: string | null = null;
  private suppressTimer: ReturnType<typeof setTimeout> | null = null;
  private messageListener: ((e: MessageEvent) => void) | null = null;

  public onNavigateUrl?: (newUrl: string, isSpa?: boolean) => void;
  public onNotification?: (notification: SyncNotification) => void;
  public getDeviceName: (uid: string) => string;

  public scrollController: ScrollSyncController;
  public interactionController: InteractionSyncController;
  public formController: FormSyncController;
  public navigationController: NavigationSyncController;

  constructor(options: SyncManagerOptions = {}) {
    this.mode = options.defaultMode ?? "all";
    this.sessionId = options.sessionId ?? `rwp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    this.excludedUids = new Set();
    this.frames = new Map();
    this.onNavigateUrl = options.onNavigateUrl;
    this.onNotification = options.onNotification;
    this.getDeviceName = options.getDeviceName ?? ((uid) => `Device ${uid.slice(0, 4)}`);

    this.scrollController = new ScrollSyncController(this);
    this.interactionController = new InteractionSyncController(this);
    this.formController = new FormSyncController(this);
    this.navigationController = new NavigationSyncController(this);

    this.bindWindowListener();
  }

  public destroy() {
    if (typeof window !== "undefined" && this.messageListener) {
      window.removeEventListener("message", this.messageListener);
      this.messageListener = null;
    }
    if (this.suppressTimer) {
      clearTimeout(this.suppressTimer);
      this.suppressTimer = null;
    }
    for (const reg of this.frames.values()) {
      reg.abortController?.abort();
    }
    this.frames.clear();
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getMode(): SyncMode {
    return this.mode;
  }

  public setMode(newMode: SyncMode) {
    this.mode = newMode;
    // Broadcast state update to all child bridges
    for (const [uid, reg] of this.frames.entries()) {
      try {
        reg.iframe.contentWindow?.postMessage(
          {
            source: "rwp-parent",
            sessionId: this.sessionId,
            type: "SYNC_STATE",
            data: {
              mode: newMode,
              excluded: this.excludedUids.has(uid),
            },
          },
          "*",
        );
      } catch {}
    }
  }

  public isExcluded(uid: string): boolean {
    return this.excludedUids.has(uid);
  }

  public toggleExclude(uid: string): boolean {
    const isNowExcluded = !this.excludedUids.has(uid);
    if (isNowExcluded) {
      this.excludedUids.add(uid);
    } else {
      this.excludedUids.delete(uid);
    }

    const reg = this.frames.get(uid);
    if (reg) {
      try {
        reg.iframe.contentWindow?.postMessage(
          {
            source: "rwp-parent",
            sessionId: this.sessionId,
            type: "SYNC_STATE",
            data: {
              mode: isNowExcluded ? "disabled" : this.mode,
              excluded: isNowExcluded,
            },
          },
          "*",
        );
      } catch {}
    }
    return isNowExcluded;
  }

  public getExcludedList(): string[] {
    return Array.from(this.excludedUids);
  }

  public getRegisteredFrames(): Map<string, FrameRegistration> {
    return this.frames;
  }

  public register(uid: string, iframe: HTMLIFrameElement): () => void {
    const existing = this.frames.get(uid);
    existing?.abortController?.abort();

    let ac: AbortController | null = null;
    try {
      if (iframe.contentDocument?.readyState === "complete") {
        ac = this.attachDomListeners(uid, iframe);
      }
    } catch {
      // Cross-origin: bridge postMessage handles it
    }

    this.frames.set(uid, {
      uid,
      iframe,
      abortController: ac,
      bridgeReady: false,
    });

    return () => {
      const reg = this.frames.get(uid);
      if (reg) {
        reg.abortController?.abort();
        this.frames.delete(uid);
      }
    };
  }

  public onFrameLoaded(uid: string) {
    const reg = this.frames.get(uid);
    if (!reg) return;
    reg.abortController?.abort();
    const ac = this.attachDomListeners(uid, reg.iframe);
    reg.abortController = ac;
  }

  public setSuppression(uid: string) {
    this.suppressUid = uid;
    if (this.suppressTimer) clearTimeout(this.suppressTimer);
    this.suppressTimer = setTimeout(() => {
      this.suppressUid = null;
    }, 60);
  }

  public broadcast(message: SyncParentMessage, driverUid?: string) {
    for (const [uid, reg] of this.frames.entries()) {
      if (uid === driverUid || this.excludedUids.has(uid)) continue;
      try {
        reg.iframe.contentWindow?.postMessage(message, "*");
      } catch {}
    }
  }

  public notify(notification: SyncNotification) {
    this.onNotification?.(notification);
  }

  public resetAll() {
    this.scrollController.resetScroll();
    this.suppressUid = null;
  }

  private bindWindowListener() {
    this.messageListener = (event: MessageEvent) => {
      const data = event.data as SyncChildMessage | undefined;
      if (!data || data.source !== "rwp-child") return;

      // Identify driver UID
      let driverUid = data.uid;
      if (!driverUid) {
        for (const [uid, reg] of this.frames.entries()) {
          try {
            if (reg.iframe.contentWindow === event.source) {
              driverUid = uid;
              break;
            }
          } catch {}
        }
      }

      if (!driverUid || this.excludedUids.has(driverUid)) return;
      if (this.suppressUid && this.suppressUid !== driverUid) return;

      // Mark bridge as ready
      if (data.type === "BRIDGE_READY") {
        const reg = this.frames.get(driverUid);
        if (reg) reg.bridgeReady = true;
        return;
      }

      // Route message to sub-controllers
      switch (data.type) {
        case "SCROLL": {
          this.scrollController.handleScroll(driverUid, data.data);
          break;
        }
        case "CLICK": {
          this.interactionController.handleClick(driverUid, data.data);
          break;
        }
        case "INPUT": {
          this.formController.handleInput(driverUid, data.data);
          break;
        }
        case "CHANGE": {
          this.formController.handleChange(driverUid, data.data);
          break;
        }
        case "TAB_CHANGE": {
          this.formController.handleTabChange(driverUid, data.data);
          break;
        }
        case "MODAL_CHANGE": {
          this.formController.handleModalChange(driverUid, data.data);
          break;
        }
        case "KEY_DOWN": {
          this.interactionController.handleKeyDown(driverUid, data.data);
          break;
        }
        case "NAVIGATE": {
          this.navigationController.handleNavigate(driverUid, data.data);
          break;
        }
        case "MATCH_FAILED": {
          this.interactionController.handleMatchFailed(driverUid, data.data.reason);
          break;
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("message", this.messageListener);
    }
  }

  private attachDomListeners(uid: string, iframe: HTMLIFrameElement): AbortController | null {
    try {
      const win = iframe.contentWindow;
      const doc = iframe.contentDocument;
      if (!win || !doc) return null;

      const ac = new AbortController();

      // Passive scroll listener
      win.addEventListener(
        "scroll",
        () => {
          if (this.mode === "disabled" || this.excludedUids.has(uid)) return;
          if (this.suppressUid && this.suppressUid !== uid) return;

          try {
            const docEl = doc.documentElement;
            const body = doc.body;
            const scrollH = Math.max(docEl ? docEl.scrollHeight : 0, body ? body.scrollHeight : 0);
            const scrollW = Math.max(docEl ? docEl.scrollWidth : 0, body ? body.scrollWidth : 0);
            const clientH = win.innerHeight || (docEl ? docEl.clientHeight : 0);
            const clientW = win.innerWidth || (docEl ? docEl.clientWidth : 0);

            const maxScrollY = Math.max(1, scrollH - clientH);
            const maxScrollX = Math.max(1, scrollW - clientW);

            const y = win.scrollY || (docEl ? docEl.scrollTop : 0) || (body ? body.scrollTop : 0) || 0;
            const x = win.scrollX || (docEl ? docEl.scrollLeft : 0) || (body ? body.scrollLeft : 0) || 0;

            const percentY = Math.min(1, Math.max(0, y / maxScrollY));
            const percentX = Math.min(1, Math.max(0, x / maxScrollX));

            this.scrollController.handleScroll(uid, {
              percentY,
              percentX,
              scrollY: y,
              scrollX: x,
            });
          } catch {}
        },
        { passive: true, signal: ac.signal },
      );

      return ac;
    } catch {
      return null;
    }
  }
}
