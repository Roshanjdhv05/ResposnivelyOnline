/**
 * Types and interfaces for the Responsive Website Previewer synchronization engine.
 */

export type SyncMode = "all" | "scroll-only" | "disabled";

export type SemanticCategory =
  | "button"
  | "link"
  | "input"
  | "select"
  | "checkbox"
  | "radio"
  | "tab"
  | "accordion"
  | "modal"
  | "other";

export interface ElementDescriptor {
  tagName: string;
  id?: string;
  name?: string;
  testId?: string;
  role?: string;
  ariaLabel?: string;
  ariaExpanded?: boolean;
  type?: string;
  href?: string;
  text?: string;
  placeholder?: string;
  value?: string;
  checked?: boolean;
  classes?: string[];
  selectorPath?: string;
  isResponsiveNav?: boolean;
  semanticCategory?: SemanticCategory;
}

export interface ScrollPayload {
  percentY: number;
  percentX?: number;
  scrollY: number;
  scrollX: number;
  containerSelector?: string;
}

export interface ClickPayload {
  element: ElementDescriptor;
  button?: number;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

export interface InputPayload {
  element: ElementDescriptor;
  value: string;
  checked?: boolean;
  inputType?: string;
}

export interface ChangePayload {
  element: ElementDescriptor;
  value: string;
  checked?: boolean;
  selectedIndex?: number;
}

export interface NavigatePayload {
  url: string;
  pathname?: string;
  search?: string;
  hash?: string;
  replace?: boolean;
  isSpa?: boolean;
}

export interface TabChangePayload {
  element: ElementDescriptor;
  tabId?: string;
  tabText?: string;
  selectedIndex?: number;
}

export interface ModalChangePayload {
  element: ElementDescriptor;
  open: boolean;
  dialogId?: string;
}

export interface KeyPayload {
  element?: ElementDescriptor;
  key: string;
  code: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
}

export type SyncMessageType =
  | "SCROLL"
  | "CLICK"
  | "NAVIGATE"
  | "INPUT"
  | "CHANGE"
  | "TAB_CHANGE"
  | "MODAL_CHANGE"
  | "KEY_DOWN"
  | "SYNC_STATE"
  | "MATCH_FAILED"
  | "BRIDGE_READY";

export interface SyncMessageBase {
  source: "rwp-child" | "rwp-parent";
  sessionId: string;
  type: SyncMessageType;
  uid?: string;
  driverUid?: string;
  timestamp?: number;
}

export interface ScrollMessage extends SyncMessageBase {
  type: "SCROLL";
  data: ScrollPayload;
}

export interface ClickMessage extends SyncMessageBase {
  type: "CLICK";
  data: ClickPayload;
}

export interface InputMessage extends SyncMessageBase {
  type: "INPUT";
  data: InputPayload;
}

export interface ChangeMessage extends SyncMessageBase {
  type: "CHANGE";
  data: ChangePayload;
}

export interface NavigateMessage extends SyncMessageBase {
  type: "NAVIGATE";
  data: NavigatePayload;
}

export interface TabChangeMessage extends SyncMessageBase {
  type: "TAB_CHANGE";
  data: TabChangePayload;
}

export interface ModalChangeMessage extends SyncMessageBase {
  type: "MODAL_CHANGE";
  data: ModalChangePayload;
}

export interface KeyDownMessage extends SyncMessageBase {
  type: "KEY_DOWN";
  data: KeyPayload;
}

export interface SyncStateMessage extends SyncMessageBase {
  type: "SYNC_STATE";
  data: {
    mode: SyncMode;
    excluded: boolean;
  };
}

export interface MatchFailedMessage extends SyncMessageBase {
  type: "MATCH_FAILED";
  data: {
    action: string;
    reason: string;
    descriptor?: ElementDescriptor;
  };
}

export interface BridgeReadyMessage extends SyncMessageBase {
  type: "BRIDGE_READY";
  data: {
    url: string;
    title: string;
    deviceUid: string;
  };
}

export type SyncChildMessage =
  | ScrollMessage
  | ClickMessage
  | InputMessage
  | ChangeMessage
  | NavigateMessage
  | TabChangeMessage
  | ModalChangeMessage
  | KeyDownMessage
  | MatchFailedMessage
  | BridgeReadyMessage;

export type SyncParentMessage =
  | ScrollMessage
  | ClickMessage
  | InputMessage
  | ChangeMessage
  | NavigateMessage
  | TabChangeMessage
  | ModalChangeMessage
  | KeyDownMessage
  | SyncStateMessage;

export interface SyncNotification {
  id: string;
  deviceUid?: string;
  deviceName?: string;
  message: string;
  type: "info" | "warning" | "error";
  timestamp: number;
}
