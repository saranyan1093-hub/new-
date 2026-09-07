import { useEffect, useState } from "react";

/**
 * Splits `progress` (0-1, driven by the audio-synced scene clock)
 * evenly across `lines` and shows one line at a time with a soft
 * fade in/out. Pure progress-driven (no independent timers), so it
 * stays in sync even if the clock jumps due to a seek.
 */
export default function SceneLines({ lines, progress, className = "" }) {
  const count = lines.length;
  const slice = 1 / count;
  let activeIndex = Math.min(count - 1, Math.floor(progress / slice));
  const localProgress = (progress - activeIndex * slice) / slice;

  // fade in over first 18%, hold, fade out over last 15% of each line's slot
  let opacity = 1;
  if (localProgress < 0.18) opacity = localProgress / 0.18;
  else if (localProgress > 0.85) opacity = Math.max(0, (1 - localProgress) / 0.15);

  const [displayIndex, setDisplayIndex] = useState(activeIndex);
  useEffect(() => {
    setDisplayIndex(activeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <div className={`scene-lines ${className}`}>
      <p
        className="scene-line script-line"
        style={{ opacity, filter: `blur(${(1 - opacity) * 6}px)` }}
      >
        {lines[displayIndex]}
      </p>
    </div>
  );
}
