import { useEffect, useRef, useState } from "react";
import { findSceneAt } from "../utils/timelineCalculator";

/**
 * Drives the whole cinematic experience from audio.currentTime.
 * - No independent setTimeout chains: every frame we re-derive
 *   "where are we" directly from the audio element's actual
 *   playback position, so pausing / seeking / resuming / a lagging
 *   browser can never desync the visuals from the song.
 * - React state (sceneIndex) only updates when the active scene
 *   actually changes, to keep re-renders cheap.
 * - clockRef exposes the live, per-frame progress (0-1 within the
 *   current scene, and overall 0-1) via a mutable ref so individual
 *   scene components can drive smooth 60fps transforms themselves
 *   without forcing a React re-render every frame.
 */
export function useTimelineClock(audioRef, plan) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const clockRef = useRef({ time: 0, duration: 0, sceneProgress: 0, scene: null, sceneIndex: 0 });
  const rafId = useRef(null);
  const lastUiUpdate = useRef(0);

  useEffect(() => {
    if (!plan) return;

    function tick(now) {
      const audio = audioRef.current;
      if (audio) {
        const t = audio.currentTime || 0;
        const dur = plan.totalDuration || audio.duration || 1;
        const found = findSceneAt(plan, t);

        if (found) {
          const { scene, index } = found;
          const sceneProgress =
            scene.duration > 0 ? Math.min(1, Math.max(0, (t - scene.start) / scene.duration)) : 1;

          clockRef.current.time = t;
          clockRef.current.duration = dur;
          clockRef.current.scene = scene;
          clockRef.current.sceneIndex = index;
          clockRef.current.sceneProgress = sceneProgress;

          // Throttle React state updates to ~15fps - plenty for
          // scene-level UI (progress bar, mounting/unmounting scenes)
          // while per-frame visuals read clockRef directly.
          if (!lastUiUpdate.current || now - lastUiUpdate.current > 66) {
            lastUiUpdate.current = now;
            setOverallProgress(dur > 0 ? Math.min(1, t / dur) : 0);
            setSceneIndex((prev) => (prev === index ? prev : index));
          }
        }
      }
      rafId.current = requestAnimationFrame(tick);
    }

    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [audioRef, plan]);

  return { sceneIndex, overallProgress, clockRef };
}
