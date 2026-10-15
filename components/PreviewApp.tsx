"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEmbedCheck } from "@/hooks/useEmbedCheck";
import { useSyncManager } from "@/hooks/useSyncManager";
import { useWorkspace } from "@/hooks/useWorkspace";
import { normalizeUrl } from "@/lib/url";
import CustomViewportDialog, { type CustomViewportValues } from "./CustomViewportDialog";
import PreviewWorkspace from "./PreviewWorkspace";
import URLToolbar from "./URLToolbar";

type DialogState = { mode: "add" } | { mode: "edit"; uid: string } | null;

interface PreviewAppProps {
  initialUrl?: string;
}

export default function PreviewApp({ initialUrl }: PreviewAppProps = {}) {
  const workspace = useWorkspace();
  const { state, hydrated } = workspace;

  const [input, setInput] = useState(initialUrl ?? "");
  const [inputError, setInputError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  // Bumped on every submit / refresh so previews reload only when the user asks them to.
  const [runId, setRunId] = useState(0);
  const [dialog, setDialog] = useState<DialogState>(null);

  // Centralized interaction and scroll synchronization manager
  const sync = useSyncManager({
    hasUrl: !!state.url,
    onNavigateUrl: (newUrl, isSpa) => {
      setInput(newUrl);
      workspace.setUrl(newUrl);
      if (!isSpa) {
        setRunId((n) => n + 1);
      }
    },
    getDeviceName: (uid) => state.devices.find((d) => d.uid === uid)?.name ?? "Preview",
  });

  // Restore the last previewed address into the input once storage has loaded,
  // or prioritize initialUrl if provided via query parameter.
  const restored = useRef(false);
  useEffect(() => {
    if (hydrated && !restored.current) {
      restored.current = true;
      if (initialUrl) {
        const norm = normalizeUrl(initialUrl);
        if (norm.ok) {
          setInput(norm.url);
          workspace.setUrl(norm.url);
          setRunId((n) => n + 1);
        } else {
          setInput(initialUrl);
        }
      } else if (state.url) {
        setInput(state.url);
      }
    }
  }, [hydrated, initialUrl, state.url, workspace]);

  const check = useEmbedCheck(hydrated ? state.url : null, runId);

  const submit = useCallback(() => {
    const result = normalizeUrl(input);
    if (!result.ok) {
      setInputError(result.error);
      setHint(null);
      return;
    }
    setInputError(null);
    setHint(result.autoNormalized ? `Loading ${result.url}` : null);
    setInput(result.url);
    workspace.setUrl(result.url);
    setRunId((n) => n + 1);
  }, [input, workspace]);

  const refreshAll = useCallback(() => {
    if (state.url) setRunId((n) => n + 1);
  }, [state.url]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    setInputError(null);
    setHint(null);
  }, []);

  const editingDevice =
    dialog?.mode === "edit" ? state.devices.find((d) => d.uid === dialog.uid) : undefined;

  const handleDialogSubmit = (values: CustomViewportValues) => {
    if (dialog?.mode === "edit") {
      workspace.customize(dialog.uid, values.name, values.width, values.height);
    } else {
      workspace.addCustom(values.name, values.width, values.height);
    }
    setDialog(null);
  };

  const { theme, compact } = state.prefs;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-ws text-fg text-[13px]">
      <URLToolbar
        value={input}
        error={inputError}
        hint={hint}
        hasPreview={!!state.url}
        theme={theme}
        compact={compact}
        syncMode={sync.mode}
        totalDevices={state.devices.length}
        excludedCount={sync.excludedUids.length}
        onSetSyncMode={sync.setMode}
        onResetSync={sync.resetSync}
        onChange={handleInputChange}
        onSubmit={submit}
        onRefreshAll={refreshAll}
        onFitAll={workspace.fitAll}
        onResetLayout={workspace.resetLayout}
        onToggleTheme={() => workspace.setPrefs({ theme: theme === "dark" ? "light" : "dark" })}
        onToggleCompact={() => workspace.setPrefs({ compact: !compact })}
        onAddPreset={workspace.addPreset}
        onAddCustom={() => setDialog({ mode: "add" })}
      />

      {hydrated ? (
        <PreviewWorkspace
          devices={state.devices}
          url={state.url}
          runId={runId}
          check={check}
          compact={compact}
          theme={theme}
          waveEnabled={state.prefs.waveEnabled !== false}
          syncMode={sync.mode}
          onSetSyncMode={sync.setMode}
          onResetSync={sync.resetSync}
          isExcluded={sync.isExcluded}
          onToggleSyncExclude={sync.toggleExclude}
          onRegisterSync={sync.register}
          onFrameSyncLoaded={sync.onFrameLoaded}
          onSyncNavigate={(newUrl, isSpa) => {
            setInput(newUrl);
            if (!isSpa) {
              workspace.setUrl(newUrl);
              setRunId((n) => n + 1);
            }
          }}
          onScrollBy={sync.scrollAllBy}
          notifications={sync.notifications}
          onDismissNotification={sync.dismissNotification}
          onToggleWave={() => workspace.setPrefs({ waveEnabled: !(state.prefs.waveEnabled !== false) })}
          onRotate={workspace.rotate}
          onZoom={workspace.setZoom}
          onRemove={workspace.remove}
          onSwitchPreset={workspace.switchPreset}
          onCustomizeDevice={(uid) => setDialog({ mode: "edit", uid })}
          onRecheck={refreshAll}
          onAddPreset={workspace.addPreset}
          onAddCustom={() => setDialog({ mode: "add" })}
          onMoveDevice={workspace.moveDevice}
          onArrangeDevices={workspace.arrangeDevices}
        />
      ) : (
        <div className="min-h-0 flex-1 bg-ws" aria-busy="true" />
      )}

      <CustomViewportDialog
        open={dialog !== null}
        title={dialog?.mode === "edit" ? "Custom viewport for this device" : "Add custom viewport"}
        submitLabel={dialog?.mode === "edit" ? "Apply" : "Add device"}
        initial={
          editingDevice
            ? { name: editingDevice.category === "custom" ? editingDevice.name : "", width: editingDevice.width, height: editingDevice.height }
            : undefined
        }
        onSubmit={handleDialogSubmit}
        onClose={() => setDialog(null)}
      />
    </div>
  );
}
