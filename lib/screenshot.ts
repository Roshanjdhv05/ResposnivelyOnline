/**
 * Screenshot support.
 *
 * Browsers deliberately do not let a page read the pixels of a cross-origin iframe, so we use the
 * Screen Capture API (the user is asked for permission) and crop the result to the preview. In
 * Chrome/Edge, Region Capture crops precisely; elsewhere we crop using the element's bounding box,
 * which is accurate when the user picks "This tab".
 */

interface CropTargetStatic {
  fromElement(element: Element): Promise<unknown>;
}

interface CroppableTrack extends MediaStreamTrack {
  cropTo?: (target: unknown) => Promise<void>;
}

export class ScreenshotError extends Error {}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isScreenshotSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getDisplayMedia === "function"
  );
}

export async function capturePreviewPng(element: HTMLElement): Promise<Blob> {
  if (!isScreenshotSupported()) {
    throw new ScreenshotError("Screen capture isn't supported in this browser.");
  }

  element.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: "browser" },
      audio: false,
      preferCurrentTab: true,
      selfBrowserSurface: "include",
    } as unknown as DisplayMediaStreamOptions);
  } catch {
    throw new ScreenshotError("Screenshot cancelled or permission denied.");
  }

  try {
    const track = stream.getVideoTracks()[0] as CroppableTrack | undefined;
    if (!track) throw new ScreenshotError("No video was captured.");

    const surface = (track.getSettings() as { displaySurface?: string }).displaySurface;
    if (surface && surface !== "browser") {
      throw new ScreenshotError('Choose "This tab" when asked what to share.');
    }

    let cropped = false;
    const CropTarget = (window as unknown as { CropTarget?: CropTargetStatic }).CropTarget;
    if (CropTarget && typeof track.cropTo === "function") {
      try {
        await track.cropTo(await CropTarget.fromElement(element));
        cropped = true;
      } catch {
        cropped = false;
      }
    }

    const video = document.createElement("video");
    video.muted = true;
    video.srcObject = stream;
    await video.play();
    await wait(cropped ? 450 : 350); // let the permission UI disappear and a fresh frame arrive

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new ScreenshotError("Canvas isn't available.");

    if (cropped) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
    } else {
      const ratio = video.videoWidth / window.innerWidth;
      const rect = element.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      ctx.drawImage(
        video,
        rect.left * ratio,
        rect.top * ratio,
        rect.width * ratio,
        rect.height * ratio,
        0,
        0,
        canvas.width,
        canvas.height,
      );
    }

    video.pause();
    video.srcObject = null;

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new ScreenshotError("Could not encode image."))),
        "image/png",
      );
    });
  } finally {
    stream.getTracks().forEach((track) => track.stop());
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
