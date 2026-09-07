import { useEffect, useRef, useState } from "react";
import { finalMessageLines } from "../data/birthdayData";
import "./FinalMessage.css";

export default function FinalMessage({ clockRef, onReplay }) {
  const [progress, setProgress] = useState(0);
  const rafId = useRef(null);

  useEffect(() => {
    function loop() {
      setProgress(clockRef.current?.sceneProgress ?? 0);
      rafId.current = requestAnimationFrame(loop);
    }
    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, [clockRef]);

  const count = finalMessageLines.length;
  const slice = 1 / count;
  const activeIndex = Math.min(count - 1, Math.floor(progress / slice));
  const local = (progress - activeIndex * slice) / slice;

  let opacity = 1;
  if (local < 0.15) opacity = local / 0.15;
  else if (local > 0.78) opacity = Math.max(0, (1 - local) / 0.22);

  const showReplay = progress > 0.94;
  // darken toward black near the very end, but keep the replay button
  // itself fully readable/clickable rather than fading it away too.
  const darkOverlay = progress > 0.88 ? Math.min(0.85, (progress - 0.88) / 0.12) : 0;

  return (
    <div className="final-scene">
      <div className="grain-overlay" />
      <p
        className={`final-line ${activeIndex >= count - 3 ? "title-line" : "script-line"}`}
        style={{ opacity, filter: `blur(${(1 - opacity) * 5}px)` }}
      >
        {finalMessageLines[activeIndex]}
      </p>
      <div className="final-dark-overlay" style={{ opacity: darkOverlay }} />
      {showReplay && (
        <button className="replay-btn" onClick={onReplay}>
          replay our story
        </button>
      )}
    </div>
  );
}
