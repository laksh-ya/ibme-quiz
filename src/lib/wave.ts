import type { SweepFn } from "glimm/react";
import { snd } from "./audio";

let providerSweep: SweepFn | null = null;
export function setWaveDriver(driver: SweepFn) { providerSweep = driver; }

// All shader, snapshot, masking, fallback and cleanup are owned by glimm's
// official provider. The application only supplies the navigation callback.
export function sweep(_root: HTMLElement, navigate: () => void): Promise<void> {
  try { snd.swoosh(); } catch {}
  if (!providerSweep) { navigate(); return Promise.resolve(); }
  return providerSweep(navigate).done;
}
