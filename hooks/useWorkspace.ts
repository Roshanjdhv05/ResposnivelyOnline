"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import {
  arrangeGrid,
  arrangeHorizontal,
  arrangeShowcase,
  arrangeVertical,
  createCustomDevice,
  createDevice,
  defaultDevices,
  isRotatable,
  newUid,
  toggleFoldState,
} from "@/lib/devices";
import { defaultState, loadState, saveState } from "@/lib/storage";
import type {
  DeviceInstance,
  DevicePreset,
  WorkspacePrefs,
  WorkspaceState,
  ZoomMode,
} from "@/lib/types";

type Action =
  | { type: "hydrate"; state: WorkspaceState }
  | { type: "add"; device: DeviceInstance }
  | { type: "addMultiple"; devices: DeviceInstance[] }
  | { type: "remove"; uid: string }
  | { type: "switch"; uid: string; preset: DevicePreset }
  | { type: "customize"; uid: string; name: string; width: number; height: number }
  | { type: "rotate"; uid: string }
  | { type: "toggleFold"; uid: string }
  | { type: "zoom"; uid: string; zoom: ZoomMode }
  | { type: "fitAll" }
  | { type: "moveDevice"; uid: string; position: { x: number; y: number } }
  | { type: "arrange"; mode: "showcase" | "horizontal" | "grid" | "vertical" }
  | { type: "prefs"; prefs: Partial<WorkspacePrefs> }
  | { type: "url"; url: string | null }
  | { type: "reset" };

function updateDevice(
  state: WorkspaceState,
  uid: string,
  fn: (device: DeviceInstance) => DeviceInstance,
): WorkspaceState {
  return {
    ...state,
    devices: state.devices.map((d) => (d.uid === uid ? fn(d) : d)),
  };
}

function reducer(state: WorkspaceState, action: Action): WorkspaceState {
  switch (action.type) {
    case "hydrate": {
      const devices = action.state.devices.map((d, i) => {
        if (!d.position) {
          return {
            ...d,
            position: { x: 80 + i * 450, y: 100 },
          };
        }
        return d;
      });
      return { ...action.state, devices };
    }
    case "add": {
      const last = state.devices[state.devices.length - 1];
      const posX = last?.position
        ? last.position.x + (last.rotated ? last.height : last.width) + 60
        : 80;
      const posY = last?.position ? last.position.y : 100;
      const device = {
        ...action.device,
        position: action.device.position ?? { x: posX, y: posY },
      };
      return { ...state, devices: [...state.devices, device] };
    }
    case "addMultiple": {
      const last = state.devices[state.devices.length - 1];
      let curX = last?.position
        ? last.position.x + (last.rotated ? last.height : last.width) + 60
        : 80;
      const curY = last?.position ? last.position.y : 100;

      const newDevices = action.devices.map((device) => {
        const d = {
          ...device,
          position: device.position ?? { x: curX, y: curY },
        };
        curX += (d.rotated ? d.height : d.width) + 60;
        return d;
      });
      return { ...state, devices: [...state.devices, ...newDevices] };
    }
    case "remove":
      return { ...state, devices: state.devices.filter((d) => d.uid !== action.uid) };
    case "switch":
      return updateDevice(state, action.uid, (d) => ({
        ...d,
        presetId: action.preset.id,
        name: action.preset.name,
        category: action.preset.category,
        width: action.preset.width,
        height: action.preset.height,
        modelId: action.preset.modelId,
        foldState: action.preset.foldState,
        dpr: action.preset.dpr,
        rotated: isRotatable(action.preset.category) ? d.rotated : false,
      }));
    case "customize":
      return updateDevice(state, action.uid, (d) => ({
        ...d,
        presetId: "custom",
        name: action.name.trim() || "Custom",
        category: "custom",
        width: action.width,
        height: action.height,
        rotated: false,
      }));
    case "rotate":
      return updateDevice(state, action.uid, (d) =>
        isRotatable(d.category) ? { ...d, rotated: !d.rotated } : d,
      );
    case "toggleFold":
      return updateDevice(state, action.uid, (d) => toggleFoldState(d));
    case "zoom":
      return updateDevice(state, action.uid, (d) => ({ ...d, zoom: action.zoom }));
    case "fitAll":
      return { ...state, devices: state.devices.map((d) => ({ ...d, zoom: "fit" as const })) };
    case "moveDevice":
      return updateDevice(state, action.uid, (d) => ({
        ...d,
        position: action.position,
      }));
    case "arrange": {
      let arranged = state.devices;
      if (action.mode === "showcase") arranged = arrangeShowcase(state.devices);
      else if (action.mode === "horizontal") arranged = arrangeHorizontal(state.devices);
      else if (action.mode === "grid") arranged = arrangeGrid(state.devices);
      else if (action.mode === "vertical") arranged = arrangeVertical(state.devices);
      return { ...state, devices: arranged };
    }
    case "prefs":
      return { ...state, prefs: { ...state.prefs, ...action.prefs } };
    case "url":
      return { ...state, url: action.url };
    case "reset":
      return { ...state, devices: defaultDevices() };
    default:
      return state;
  }
}

/**
 * Owns the workspace configuration (devices, orientations, zoom, preferences, last URL) and keeps
 * it in localStorage. State is loaded after mount so server and client markup always match.
 */
export function useWorkspace() {
  const [state, dispatch] = useReducer(reducer, undefined, defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadState();
    if (stored) dispatch({ type: "hydrate", state: stored });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [hydrated, state]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.prefs.theme);
  }, [state.prefs.theme]);

  const addPreset = useCallback(
    (preset: DevicePreset) => dispatch({ type: "add", device: createDevice(preset, newUid()) }),
    [],
  );
  const addMultiplePresets = useCallback(
    (presets: DevicePreset[]) =>
      dispatch({
        type: "addMultiple",
        devices: presets.map((p) => createDevice(p, newUid())),
      }),
    [],
  );
  const addCustom = useCallback(
    (name: string, width: number, height: number) =>
      dispatch({ type: "add", device: createCustomDevice(name, width, height, newUid()) }),
    [],
  );
  const remove = useCallback((uid: string) => dispatch({ type: "remove", uid }), []);
  const switchPreset = useCallback(
    (uid: string, preset: DevicePreset) => dispatch({ type: "switch", uid, preset }),
    [],
  );
  const customize = useCallback(
    (uid: string, name: string, width: number, height: number) =>
      dispatch({ type: "customize", uid, name, width, height }),
    [],
  );
  const rotate = useCallback((uid: string) => dispatch({ type: "rotate", uid }), []);
  const toggleFold = useCallback((uid: string) => dispatch({ type: "toggleFold", uid }), []);
  const setZoom = useCallback(
    (uid: string, zoom: ZoomMode) => dispatch({ type: "zoom", uid, zoom }),
    [],
  );
  const fitAll = useCallback(() => dispatch({ type: "fitAll" }), []);
  const moveDevice = useCallback(
    (uid: string, position: { x: number; y: number }) =>
      dispatch({ type: "moveDevice", uid, position }),
    [],
  );
  const arrangeDevices = useCallback(
    (mode: "showcase" | "horizontal" | "grid" | "vertical") =>
      dispatch({ type: "arrange", mode }),
    [],
  );
  const setPrefs = useCallback(
    (prefs: Partial<WorkspacePrefs>) => dispatch({ type: "prefs", prefs }),
    [],
  );
  const setUrl = useCallback((url: string | null) => dispatch({ type: "url", url }), []);
  const resetLayout = useCallback(() => dispatch({ type: "reset" }), []);

  return useMemo(
    () => ({
      state,
      hydrated,
      addPreset,
      addMultiplePresets,
      addCustom,
      remove,
      switchPreset,
      customize,
      rotate,
      toggleFold,
      setZoom,
      fitAll,
      moveDevice,
      arrangeDevices,
      setPrefs,
      setUrl,
      resetLayout,
    }),
    [
      state,
      hydrated,
      addPreset,
      addMultiplePresets,
      addCustom,
      remove,
      switchPreset,
      customize,
      rotate,
      toggleFold,
      setZoom,
      fitAll,
      moveDevice,
      arrangeDevices,
      setPrefs,
      setUrl,
      resetLayout,
    ],
  );
}
