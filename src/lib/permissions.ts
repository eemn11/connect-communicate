const PERMISSIONS_STORE = "together-permissions-asked-v1";

function key(userId: string) {
  return `${PERMISSIONS_STORE}:${userId}`;
}

/** Whether this account already answered the permission prompt on this device. */
export function hasAskedPermissions(userId: string): boolean {
  try {
    return localStorage.getItem(key(userId)) === "yes";
  } catch {
    return false;
  }
}

export function markPermissionsAsked(userId: string) {
  try {
    localStorage.setItem(key(userId), "yes");
  } catch {
    /* Device storage may be unavailable. */
  }
}

export type MediaPermissionResult = "granted" | "denied" | "unavailable";

/**
 * Ask the browser for microphone and camera access, then immediately release
 * them — this only warms the permission so later features do not interrupt.
 * Photos need no browser prompt; the device asks when a photo is picked.
 */
export async function requestMediaPermissions(): Promise<MediaPermissionResult> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) return "unavailable";
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    stream.getTracks().forEach(track => track.stop());
    return "granted";
  } catch {
    return "denied";
  }
}
